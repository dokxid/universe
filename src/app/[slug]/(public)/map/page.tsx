import { MapOverlay } from "@/app/components/map/map-overlay/map-overlay";
import { MapPanel } from "@/app/components/map/map-panel";
import { AppSidebar } from "@/app/components/sidebar/app-sidebar";
import { ExploreSidebar } from "@/app/components/sidebar/explore-sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { getExperiencesDTO } from "@/data/dto/experience-dto";
import {
    getAllPublicStoriesDTO,
    getLabPublicStoriesDTO,
} from "@/data/dto/story-dto";
import { getTagsDTO } from "@/data/dto/tag-dto";
import { unstable_cache } from "next/cache";
import { Suspense } from "react";

export const experimental_ppr = true;

export async function generateStaticParams() {
    const experiences = await getExperiencesDTO();
    return experiences.map((experience) => ({
        slug: experience.slug,
    }));
}

// Create cached versions of your data fetching functions
const getCachedExperiences = unstable_cache(
    async () => getExperiencesDTO(),
    ["experiences"],
    {
        revalidate: 3600, // Cache for 1 hour
        tags: ["experiences"],
    }
);

const getCachedTags = unstable_cache(async () => getTagsDTO(), ["tags"], {
    revalidate: 3600, // Cache for 1 hour
    tags: ["tags"],
});

const getCachedPublicStories = unstable_cache(
    async () => getAllPublicStoriesDTO(),
    ["public-stories"],
    {
        revalidate: 1800, // Cache for 30 minutes
        tags: ["stories", "public-stories"],
    }
);

const getCachedLabStories = unstable_cache(
    async (slug: string) => getLabPublicStoriesDTO(slug),
    ["lab-stories"],
    {
        revalidate: 1800, // Cache for 30 minutes
        tags: ["stories", "lab-stories"],
    }
);

export default async function MapView({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    // Use cached functions
    let storiesPromise;
    if (slug === "universe") {
        storiesPromise = getCachedPublicStories();
    } else {
        storiesPromise = getCachedLabStories(slug);
    }

    const experiencesPromise = getCachedExperiences();
    const tagsPromise = getCachedTags();

    return (
        <div className="relative w-screen h-screen flex">
            <AppSidebar />
            <div className="flex grow flex-row">
                <div className="grow relative">
                    {/* map */}
                    <div className="absolute z-20 w-full h-full">
                        <Suspense
                            fallback={<Skeleton className="w-full h-full" />}
                        >
                            <MapPanel
                                tagsPromise={tagsPromise}
                                experienceSlug={slug}
                                experiencesPromise={experiencesPromise}
                                storiesPromise={storiesPromise}
                            />
                        </Suspense>
                    </div>

                    {/* overlay */}
                    <div className="absolute z-30 w-full h-full pointer-events-none">
                        <Suspense
                            fallback={<Skeleton className="w-full h-full" />}
                        >
                            <MapOverlay tagsPromise={tagsPromise} slug={slug} />
                        </Suspense>
                    </div>
                </div>
            </div>
            <Suspense fallback={null}>
                <ExploreSidebar
                    experiencesPromise={experiencesPromise}
                    slug={slug}
                />
            </Suspense>
        </div>
    );
}
