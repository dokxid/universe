import { Skeleton } from "@/components/ui/skeleton";

export function UserWidgetSkeleton() {
    return (
        <div className="py-2 gap-0.5">
            <Skeleton className="w-32 h-[14px] my-[5px]" />
            <div className="flex flex-col gap-0.5">
                <Skeleton className="w-1/2 h-[20px] my-[6px]" />
                <Skeleton className="w-3/4 h-[20px] my-[6px]" />
            </div>
        </div>
    );
}

export function UserWidgetAuthorizedSkeleton() {
    return (
        <div className="gap-2 flex flex-row h-[36px]">
            <Skeleton className="size-[32px] grow-0" />
            <div className="flex flex-col gap-1 grow">
                <Skeleton className="w-3/4 h-[14px] justify-between" />
                <Skeleton className="w-1/2 h-[10px]" />
            </div>
            <div className="flex flex-row gap-2">
                <Skeleton className="size-[36px]" />
                <Skeleton className="size-[36px]" />
            </div>
        </div>
    );
}
