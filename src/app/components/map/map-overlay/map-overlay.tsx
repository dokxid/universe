import { MapWidgetHolder } from "@/app/components/map/map-overlay/map-widget-holder";
import { NavigationWidgetHolder } from "@/app/components/map/map-overlay/navigation-widget-holder";
import { StoryDetails } from "@/app/components/map/map-overlay/story-details";
import { StoryWidgetHolder } from "@/app/components/map/map-overlay/story-widget-holder";
import { getAllPublicStoriesDTO } from "@/data/dto/story-dto";
import { UnescoTagDTO } from "@/types/api";
import { Suspense } from "react";

export async function MapOverlay({
    tagsPromise,
    slug,
    selectedExperience,
}: {
    tagsPromise: Promise<UnescoTagDTO[]>;
    slug: string;
    selectedExperience: string;
}) {
    const experienceSlug = slug;
    const storiesPromise = getAllPublicStoriesDTO();

    return (
        <div className={"relative w-full h-full p-4"}>
            <div className="relative w-full h-full">
                {/* top left */}
                <div className={"absolute top-0 left-0 flex flex-col gap-3"}>
                    <NavigationWidgetHolder
                        selectedExperience={selectedExperience}
                        slug={experienceSlug}
                    />
                </div>

                {/* top right */}
                <div
                    className={
                        "absolute top-0 right-0 flex flex-col gap-3 h-full"
                    }
                >
                    <div className={"flex flex-col gap-3 items-end h-full"}>
                        <Suspense fallback={<div>loading stories...</div>}>
                            <StoryWidgetHolder slug={slug} />
                        </Suspense>
                        <Suspense>
                            <StoryDetails
                                tagsPromise={tagsPromise}
                                storiesPromise={storiesPromise}
                            />
                        </Suspense>
                    </div>
                </div>

                {/* bottom left */}
                <div className={"absolute bottom-0 left-0 flex flex-col gap-3"}>
                    <MapWidgetHolder slug={slug} />
                </div>
                {/* bottom right */}
                <div
                    className={"absolute bottom-0 right-0 flex flex-col gap-3"}
                >
                    <div
                        className={
                            "flex flex-col gap-3 pointer-events-auto w-10"
                        }
                    >
                        {/* <Button
                            variant={"secondary_custom"}
                            className={"size-10"}
                        >
                            <Plus size={10} />
                        </Button> */}
                    </div>
                </div>
            </div>
        </div>
    );
}
