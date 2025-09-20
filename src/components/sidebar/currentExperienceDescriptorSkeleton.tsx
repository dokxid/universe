import { Skeleton } from "../ui/skeleton";

export function CurrentExperienceDescriptorSkeleton() {

    return (
        <div className={"flex flex-col text-left w-full text-wrap gap-2"}>
            <p className={"text-xs"}>Current experience:</p>
                <Skeleton className={"h-2 w-1/3"} />
                <Skeleton className={"h-2 w-1/2"} />
        </div>
    )
}
