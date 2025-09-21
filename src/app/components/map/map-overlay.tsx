import { VerticalWidgetHolder } from "@/app/components/map/map-overlay/vertical-widget-holder";
import { getExperienceDTO } from "@/data/dto/story-dto";

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
    const experience = await getExperienceDTO(selectedExperience);

    return (
        <div className={"relative w-full h-full p-4"}>
            <div className="relative w-full h-full">
                <div className={"absolute top-0 left-0 flex flex-col gap-3"}>
                    <VerticalWidgetHolder
                        experience={experience}
                        slug={experienceSlug}
                    />
                </div>
                <div
                    className={
                        "absolute top-0 right-0 flex flex-col gap-3 h-full"
                    }
                >
                    {/* <StoryDetails /> */}
                </div>
            </div>
        </div>
    );
}
