import { Separator } from "@/components/ui/separator";
import { SidebarInset } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="w-full h-full flex">
            {/* Sidebar skeleton */}
            <div className="w-64 h-screen bg-sidebar border-r">
                <div className="p-4 space-y-4">
                    <Skeleton className="h-8 w-32" />
                    <div className="space-y-2">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <Skeleton key={i} className="h-6 w-full" />
                        ))}
                    </div>
                </div>
            </div>

            <SidebarInset>
                {/* Header skeleton */}
                <header className="flex h-16 shrink-0 gap-2 border-b">
                    <div className="flex items-center gap-2 px-3">
                        <Skeleton className="h-4 w-4" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 h-4"
                        />
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-16" />
                            <span className="text-muted-foreground">/</span>
                            <Skeleton className="h-4 w-24" />
                        </div>
                    </div>
                </header>

                {/* Content skeleton */}
                <div className="flex flex-1 flex-col gap-4 p-4 overflow-y-auto items-center">
                    {/* Page title skeleton */}
                    <div className="w-full max-w-4xl space-y-4">
                        <Skeleton className="h-8 w-64 mx-auto" />
                        <Skeleton className="h-4 w-96 mx-auto" />
                    </div>

                    {/* Gallery grid skeleton */}
                    <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="space-y-4">
                                <Skeleton className="h-48 w-full rounded-lg" />
                                <div className="space-y-2">
                                    <Skeleton className="h-6 w-3/4" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-2/3" />
                                </div>
                                <Skeleton className="h-10 w-24" />
                            </div>
                        ))}
                    </div>
                </div>
            </SidebarInset>
        </div>
    );
}
