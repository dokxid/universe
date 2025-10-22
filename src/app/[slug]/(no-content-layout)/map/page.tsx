import { MapOverlay } from "@/app/components/map/map-overlay/map-overlay";
import { MapPanel } from "@/app/components/map/map-panel";
import { AppSidebar } from "@/app/components/sidebar/app-sidebar";
import { ExploreSidebar } from "@/app/components/sidebar/explore-sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import {
    getExperiencesDTO,
    getPublicLabsDTO,
} from "@/data/dto/getters/get-experience-dto";
import {
    getAllPublicStoriesDTO,
    getLabPublicStoriesDTO,
} from "@/data/dto/getters/get-story-dto";
import { getTagsDTO } from "@/data/dto/getters/get-tag-dto";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const experimental_ppr = true;

export async function generateStaticParams() {
    try {
        const experiences = await getExperiencesDTO();
        return experiences.map((experience) => ({
            slug: experience.slug,
        }));
    } catch (error) {
        console.error("Error generating static params:", error);
        return [];
    }
}

async function getStoriesForSlug(slug: string) {
    if (slug === "universe") {
        return getAllPublicStoriesDTO();
    } else {
        return getLabPublicStoriesDTO(slug);
    }
}

export default async function MapView({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    if (slug === "superadmin") {
        redirect("/universe");
    }
    // Use cached functions
    const storiesPromise = getStoriesForSlug(slug);
    const experiencesPromise = getPublicLabsDTO();
    const tagsPromise = getTagsDTO();

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
                            <MapOverlay slug={slug} />
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
