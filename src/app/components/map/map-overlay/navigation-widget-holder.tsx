import { ExperienceDetails } from "@/app/components/map/experience-details";
import { FlyBackButton } from "@/app/components/map/map-overlay/fly-back-button";
import ToggleDescriptorButton from "@/app/components/map/map-overlay/toggle-descriptor-button";
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
    const experience = experiences.find(
        (exp) => exp.slug === selectedExperience
    );

    return (
        <>
            <div
                className={
                    "flex flex-row gap-3 pointer-events-auto h-10 shadow-2xl"
                }
            >
                <SidebarTrigger
                    variant={"secondary"}
                    className="pointer-events-auto size-10 hover:ring-2"
                />
                <Suspense fallback={<div>loading tags...</div>}>
                    <FilterStoriesDialog tagsPromise={tagsPromise} />
                </Suspense>
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
                <ToggleDescriptorButton />
            </div>
            <Suspense fallback={<div>loading experience...</div>}>
                <ExperienceDetails experience={experience as Experience} />
            </Suspense>
        </>
    );
}
