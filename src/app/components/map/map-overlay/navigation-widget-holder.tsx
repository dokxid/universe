import { FilterStoriesDialog } from "@/app/components/dialog/filter-stories-dialog";
import { ActiveFilterInformation } from "@/app/components/map/map-overlay/active-filter-information";
import { FlyBackButton } from "@/app/components/map/map-overlay/fly-back-button";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { getUniqueTagDTOsForLab } from "@/data/dto/getters/get-tag-dto";
import { Suspense } from "react";

export async function NavigationWidgetHolder({ slug }: { slug: string }) {
    const tagsPromise = getUniqueTagDTOsForLab(slug);

    return (
        <div className={"flex flex-col gap-3"}>
            <div className={"flex flex-row gap-2 pointer-events-auto h-10"}>
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
                <Suspense fallback={<Skeleton className="w-10 h-10" />}>
                    <FlyBackButton />
                </Suspense>
                {/* <ToggleDescriptorButton /> */}
            </div>
            <ActiveFilterInformation />
        </div>
    );
}
