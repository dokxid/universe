import { VerticalWidgetHolder } from "@/app/components/map/map-overlay/vertical-widget-holder";
import { getExperiencesDTO } from "@/data/dto/story-dto";

export async function MapOverlay() {
    const experiences = await getExperiencesDTO();
    return (
        <div className={"relative w-full h-full p-5"}>
            <div className="relative w-full h-full">
                <div className={"absolute top-0 left-0 flex flex-col gap-3"}>
                    <VerticalWidgetHolder experiences={experiences} />
                </div>
            </div>
        </div>
    );
}
