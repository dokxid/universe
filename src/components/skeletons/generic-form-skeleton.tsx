import { Skeleton } from "@/components/ui/skeleton";

export function GenericFormSkeleton() {
    return (
        <div className={"flex flex-col gap-4"}>
            <div className={"flex flex-col gap-2"}>
                <Skeleton className={"h-6 w-1/2"} />
                <Skeleton className={"h-4 w-full"} />
            </div>
            <div className={"flex flex-col gap-2"}>
                <Skeleton className={"h-6 w-1/2"} />
                <Skeleton className={"h-4 w-full"} />
            </div>
            <div className={"flex flex-col gap-2"}>
                <Skeleton className={"h-6 w-1/2"} />
                <Skeleton className={"h-4 w-full"} />
            </div>
            <div className={"flex flex-col gap-2"}>
                <Skeleton className={"h-6 w-1/2"} />
                <Skeleton className={"h-4 w-full"} />
            </div>
            <div className={"flex flex-col gap-2"}>
                <Skeleton className={"h-6 w-1/2"} />
                <Skeleton className={"h-4 w-full"} />
            </div>
        </div>
    );
}
