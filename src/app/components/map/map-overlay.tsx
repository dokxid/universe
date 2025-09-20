import { VerticalWidgetHolder } from "@/app/components/map/map-overlay/vertical-widget-holder";
import { getExperiencesDTO } from "@/data/dto/story-dto";

export async function MapOverlay() {
    const experiences = await getExperiencesDTO()
    return (
        <div className={"relative w-full h-full"}>
            {/* navigation widget holder */}
            <div className={"absolute top-5 left-5 flex flex-col gap-3"}>
                <VerticalWidgetHolder experiences={experiences} />
            </div>
        </div>
    );
}
