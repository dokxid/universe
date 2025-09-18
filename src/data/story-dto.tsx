import "server-only";
import { getCurrentUser, isEditor } from "./auth";
import { User, WorkOS } from "@workos-inc/node";
import { clientPromise } from "@/lib/mongodb/connections";
import { ExperienceData, StoryData } from "@/types/api";

const workos = new WorkOS(process.env.WORKOS_API_KEY || "");
const client = await clientPromise
    .then((client) => {
        return client;
    })
    .catch((err) => {
        throw new Error(err);
    });

async function getExperiences() {
    try {
        const experiences = await client
            .db("hl-universe")
            .collection<ExperienceData>("experiences")
            .find({})
            .toArray();
        return experiences;
    } catch (err) {
        throw new Error(err instanceof Error ? err.message : "Unknown error");
    }
}

async function getStories(
    viewer?: User,
    experienceSlug?: string
): Promise<StoryData[]> {
    try {
        const experiences = await getExperiences();
        if (experienceSlug && viewer) {
            const filteredStories =
                experiences
                    .filter((experience) => experience.slug == experienceSlug)
                    .pop()?.stories ?? [];
            return await canSeePrivateStory(viewer, experienceSlug)
                ? filteredStories
                : filteredStories.filter((story) => !story.draft && !story.published);
        }
        let stories: StoryData[];
        stories = experiences.flatMap((experience) => experience.stories).filter((story) => !story.draft && story.published);
        return stories;
    } catch (err) {
        throw new Error(err instanceof Error ? err.message : "Unknown error");
    }
}

function canSeePublicStory(viewer: User) {
    return true;
}

async function canSeePrivateStory(viewer: User, experienceSlug: string) {
    const client = await clientPromise;
    const db = client.db("hl-universe");
    const experience = await db
        .collection("experiences")
        .findOne({ slug: experienceSlug });

    if (!experience) {
        return false;
    }
    const organizationId = experience.organizationId;
    const membership = await workos.userManagement
        .listOrganizationMemberships({
            userId: viewer.id,
            organizationId: organizationId,
        })
        .then((membership) => {
            const membershipToReturn = membership.data.pop();
            if (membershipToReturn === undefined) {
                throw new Error("no membership found");
            }
            return membershipToReturn;
        })
        .catch((err) => {
            throw new Error(err);
        });

    return membership.status == "active" && isEditor(membership.role.slug);
}

export function getPublicStoriesDTO() {
    return getStories();
}

export async function getLabStoriesDTO(experienceSlug: string) {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        throw new Error("Not authenticated");
    }
    return getStories(currentUser, experienceSlug);
}
