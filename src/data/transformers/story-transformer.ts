import { buildDisplayedName } from "@/data/transformers/user-transformer";
import { Prisma } from "@/generated/prisma/client";
import { validateCoordinates } from "@/lib/utils/validate-coordinates";
import { StoryDTO } from "@/types/dtos";

export async function sanitizeToStoryDTO(
    rawStory: Prisma.StoryModel & {
        author: Prisma.UserModel;
        tags: Prisma.TagModel[];
        elevationRequests: Prisma.ElevationRequestModel[];
        lab: Prisma.LabModel;
    },
): Promise<StoryDTO> {
    try {
        const sanitizedStory: StoryDTO = {
            id: rawStory.id,
            title: rawStory.title,
            content: rawStory.content,
            draft: rawStory.draft,
            location: {
                type: rawStory.location.type,
                coordinates: validateCoordinates(rawStory.location.coordinates),
            },
            tags: rawStory.tags,
            year: rawStory.year,
            featuredImageUrl: rawStory.featuredImageUrl,
            visibleUniverse: rawStory.visibleUniverse,
            license: rawStory.license,
            elevationRequests: rawStory.elevationRequests,
            author: {
                id: rawStory.author.id,
                name: buildDisplayedName(rawStory.author),
                profilePictureUrl:
                    rawStory.author.profilePictureUrl ?? undefined,
            },
            lab: {
                id: rawStory.lab.id,
                name: rawStory.lab.name,
                slug: rawStory.lab.slug,
            },
            createdAt: rawStory.createdAt,
            updatedAt: rawStory.updatedAt,
        };
        return sanitizedStory;
    } catch (error) {
        console.error("Error sanitizing story:", error);
        throw new Error(
            error instanceof Error ? error.message : "Unknown error",
        );
    }
}
