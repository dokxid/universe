import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function StoryWidgetHolderSkeleton() {
    return (
        <Card className={"w-[40svh]"}>
            <div
                className={
                    "flex flex-row items-center mb-1 justify-between sticky py-4 top-0"
                }
            >
                <div className={"flex flex-row items-center gap-3"}>
                    <Skeleton className={"size-10 rounded-full"} />
                    <div className={"flex flex-col gap-1"}>
                        <Skeleton className={"h-[16px] w-32"} />
                        <Skeleton className={"h-[14px] w-32"} />
                    </div>
                </div>
                <Skeleton className={"size-10 rounded-md"} />
            </div>
        </Card>
    );
}
