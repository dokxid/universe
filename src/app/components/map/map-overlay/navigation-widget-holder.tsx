import { ActiveFilterInformation } from "@/app/components/map/map-overlay/active-filter-information";
import { FlyBackButton } from "@/app/components/map/map-overlay/fly-back-button";
import { FilterStoriesDialog } from "@/app/components/modal/filter-stories-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { getTagsDTO } from "@/data/dto/tag-dto";
import { Suspense } from "react";

// const Geocoder = dynamic(
//     () =>
//         import("@mapbox/search-js-react").then((mod) => ({
//             default: mod.Geocoder,
//         })),
//     { ssr: false }
// );

export async function NavigationWidgetHolder() {
    const tagsPromise = getTagsDTO();

    return (
        <div className={"flex flex-col gap-3"}>
            <div className={"flex flex-row gap-3 pointer-events-auto h-10"}>
                <SidebarTrigger
                    variant={"secondary_custom"}
                    className="pointer-events-auto size-10 hover:ring-2"
                />
                <Suspense
                    fallback={
                        <Button size={"icon"} disabled={true}>
                            <Spinner />
                        </Button>
                    }
                >
                    <FilterStoriesDialog
                        tagsPromise={tagsPromise}
                        size={"icon-lg"}
                    />
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
                <Suspense fallback={<Skeleton className="w-10 h-10" />}>
                    <FlyBackButton />
                </Suspense>
                {/* <ToggleDescriptorButton /> */}
            </div>
            <ActiveFilterInformation />
        </div>
    );
}
