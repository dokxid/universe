import { ExperienceDetails } from "@/app/components/map/experience-details";
import { ClearFilterButton } from "@/app/components/map/map-overlay/clear-filter-button";
import { FlyBackButton } from "@/app/components/map/map-overlay/fly-back-button";
import ToggleDescriptorButton from "@/app/components/map/map-overlay/toggle-descriptor-button";
import ToggleGlobeButton from "@/app/components/map/map-overlay/toggle-globe-button";
import { FilterStoriesDialog } from "@/app/components/modal/filter-stories-dialog";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getExperiencesDTO } from "@/data/dto/experience-dto";
import { getTagsDTO } from "@/data/dto/tag-dto";
import { Experience } from "@/types/api";
import { Suspense } from "react";

// const Geocoder = dynamic(
//     () =>
//         import("@mapbox/search-js-react").then((mod) => ({
//             default: mod.Geocoder,
//         })),
//     { ssr: false }
// );

export async function NavigationWidgetHolder({
    selectedExperience,
    slug,
}: {
    selectedExperience: string | null;
    slug: string;
}) {
    const experiences = await getExperiencesDTO();
    const tagsPromise = getTagsDTO();
    const expParam = selectedExperience;
    const isUniverseView = slug === "universe" && !expParam;
    const experience = experiences.find(
        (exp) => exp.slug === selectedExperience
    );

    return (
        <>
            <div className={"flex flex-row gap-3 pointer-events-auto h-10"}>
                <SidebarTrigger
                    variant={"secondary"}
                    className="pointer-events-auto size-10 hover:ring-2"
                />
                <FilterStoriesDialog tagsPromise={tagsPromise} />
                <ToggleGlobeButton />
                {/* {isUniverseView && (
                    <Geocoder
                        accessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN!}
                        options={{
                            language: "en",
                            country: "US",
                        }}
                        theme={geocoderTheme}
                    />
                )} */}
                <FlyBackButton
                    isUniverseView={slug === "universe"}
                    isVisible={expParam !== "universe"}
                />
                <ToggleDescriptorButton visible={!isUniverseView} />
                <ClearFilterButton visible={!isUniverseView} />
            </div>
            <Suspense>
                <ExperienceDetails
                    visible={!isUniverseView}
                    experience={experience as Experience}
                />
            </Suspense>
        </>
    );
}
