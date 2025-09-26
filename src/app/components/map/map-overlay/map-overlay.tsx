import { StoryWidgetHolder } from "@/app/components/map/map-overlay/story-widget-holder";
import { VerticalWidgetHolder } from "@/app/components/map/map-overlay/vertical-widget-holder";
import { getExperiencesDTO } from "@/data/dto/experience-dto";
import { getAllPublicStoriesDTO } from "@/data/dto/story-dto";

export async function MapOverlay({
    slug,
    experienceSearchParam,
}: {
    slug: string;
    experienceSearchParam: string | string[] | undefined;
}) {
    const experienceSlug = slug ?? "universe";
    const selectedExperience =
        experienceSearchParam && !Array.isArray(experienceSearchParam)
            ? experienceSearchParam
            : slug;
    const experiences = JSON.stringify(await getExperiencesDTO());
    const stories = JSON.stringify(await getAllPublicStoriesDTO());

    return (
        <div className={"relative w-full h-full p-4"}>
            <div className="relative w-full h-full">
                {/* top left */}
                <div className={"absolute top-0 left-0 flex flex-col gap-3"}>
                    <VerticalWidgetHolder
                        selectedExperience={selectedExperience}
                        experiences={experiences}
                        slug={experienceSlug}
                    />
                </div>

                {/* top right */}
                <div
                    className={
                        "absolute top-0 right-0 flex flex-col gap-3 h-full"
                    }
                >
                    <StoryWidgetHolder stories={stories} slug={slug} />
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
