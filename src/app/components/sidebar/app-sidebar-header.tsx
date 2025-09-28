import LabHeader from "@/app/components/sidebar/lab-header";
import { UniverseHeader } from "@/app/components/sidebar/universe-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export function AppSidebarHeader({ slug }: { slug: string }) {
    return (
        <>
            {slug === "universe" && (
                <Suspense
                    fallback={<Skeleton className="w-full h-full"></Skeleton>}
                >
                    <UniverseHeader />
                </Suspense>
            )}

            {slug !== "universe" && (
                <Suspense
                    fallback={<Skeleton className="w-full h-full"></Skeleton>}
                >
                    <LabHeader slug={slug} />
                </Suspense>
            )}
        </>
    );
}
