import { NavigationWidgetHolder } from "@/app/components/map/map-overlay/navigation-widget-holder";
import { StoryWidgetHolder } from "@/app/components/map/map-overlay/story-widget-holder";
import { getAllPublicStoriesDTO } from "@/data/dto/story-dto";

export async function MapOverlay({
    slug,
    selectedExperience,
}: {
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
                    <StoryWidgetHolder
                        storiesPromise={storiesPromise}
                        slug={slug}
                    />
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
