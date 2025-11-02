import { MapOverlay } from "@/app/components/map/map-overlay/map-overlay";
import { MapPanel } from "@/app/components/map/map-panel";
import { AppSidebar } from "@/app/components/sidebar/app-sidebar";
import { ExploreSidebar } from "@/app/components/sidebar/explore-sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import {
    getLabsDTO,
    getPublicLabsDTO,
} from "@/data/dto/getters/get-lab-dto";
import {
    getAllPublicStoryPinsDTO, getLabPublicStoryPinsDTO
} from "@/data/dto/getters/get-story-dto";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const experimental_ppr = true;

export async function generateStaticParams() {
    try {
        const labs = await getLabsDTO();
        return labs.map((lab) => ({
            slug: lab.slug,
        }));
    } catch (error) {
        console.error("Error generating static params:", error);
        return [];
    }
}

async function getStoryPinsForSlug(slug: string) {
    if (slug === "universe") {
        return getAllPublicStoryPinsDTO();
    } else {
        return getLabPublicStoryPinsDTO(slug);
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
    const storiesPromise = getStoryPinsForSlug(slug);
    const labsPromise = getPublicLabsDTO();

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
                                labSlug={slug}
                                labPromise={labsPromise}
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
                    labsPromise={labsPromise}
                    slug={slug}
                />
            </Suspense>
        </div>
    );
}
