import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export function UniverseSidebarSkeleton() {
    return (
        <div className="flex flex-col h-full w-full max-w-[18rem] md:max-w-[17rem] py-4 px-4 bg-sidebar">
            <div className="flex flex-col gap-2 pb-4">
                <div className="flex flex-col h-[88px] justify-between">
                    <Skeleton className="w-3/4 h-[40px]" />
                    <Skeleton className="w-4/5 h-[40px]" />
                </div>
                <div className="mt-2 flex flex-col h-[180px] justify-between">
                    <Skeleton className="w-full h-[12px]" />
                    <Skeleton className="w-full h-[12px]" />
                    <Skeleton className="w-full h-[12px]" />
                    <Skeleton className="w-full h-[12px]" />
                    <Skeleton className="w-full h-[12px]" />
                    <Skeleton className="w-full h-[12px]" />
                    <Skeleton className="w-full h-[12px]" />
                    <Skeleton className="w-full h-[12px]" />
                    <Skeleton className="w-full h-[12px]" />
                    <Skeleton className="w-full h-[12px]" />
                </div>
                <Separator className="mt-4" />
            </div>
            <div className="h-full flex flex-col">
                {/* First Group - EXPLORE UNIVERSE */}
                <div className="py-2 gap-0.5">
                    <Skeleton className="w-32 h-[14px] my-[5px]" />
                    <div className="flex flex-col gap-0.5">
                        <Skeleton className="w-3/4 h-[20px] my-[6px]" />
                        <Skeleton className="w-3/4 h-[20px] my-[6px]" />
                        <Skeleton className="w-3/4 h-[20px] my-[6px]" />
                        <Skeleton className="w-1/2 h-[20px] my-[6px]" />
                    </div>
                </div>
                <div className="py-2 gap-0.5">
                    <Skeleton className="w-32 h-[14px] my-[5px]" />
                    <div className="flex flex-col gap-0.5">
                        <Skeleton className="w-3/4 h-[20px] my-[6px]" />
                        <Skeleton className="w-3/4 h-[20px] my-[6px]" />
                        <Skeleton className="w-1/2 h-[20px] my-[6px]" />
                    </div>
                </div>

                <div className="grow"></div>

                {/* Second Group - SUPER ADMIN FEATURES */}
                <div className="py-2 gap-0.5">
                    <Skeleton className="w-32 h-[14px] my-[5px]" />
                    <div className="flex flex-col gap-0.5">
                        <Skeleton className="w-3/4 h-[20px] my-[6px]" />
                        <Skeleton className="w-3/4 h-[20px] my-[6px]" />
                        <Skeleton className="w-3/4 h-[20px] my-[6px]" />
                    </div>
                </div>
                <div className="py-2 gap-0.5">
                    <Skeleton className="w-32 h-[14px] my-[5px]" />
                    <div className="flex flex-col gap-0.5">
                        <Skeleton className="w-1/2 h-[20px] my-[6px]" />
                        <Skeleton className="w-3/4 h-[20px] my-[6px]" />
                    </div>
                </div>
            </div>
            <div className="py-3">
                <Skeleton className="w-full h-[40px]" />
            </div>
        </div>
    );
}
