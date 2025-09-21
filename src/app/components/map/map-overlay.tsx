import { VerticalWidgetHolder } from "@/app/components/map/map-overlay/vertical-widget-holder";
import { getExperiencesDTO } from "@/data/dto/story-dto";

export async function MapOverlay() {
    const experiences = await getExperiencesDTO();
    return (
        <div className={"relative w-full h-full p-4"}>
            <div className="relative w-full h-full">
                <div className={"absolute top-0 left-0 flex flex-col gap-3"}>
                    <VerticalWidgetHolder experiences={experiences} />
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
