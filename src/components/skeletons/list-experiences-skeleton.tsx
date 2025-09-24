import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ListExperiencesSkeleton() {
    return (
        <Card className="w-full mx-auto pt-0 flex-row md:flex-col brightness-50 grayscale overflow-clip">
            <CardHeader className="overflow-hidden p-0">
                <AspectRatio ratio={16 / 9}>
                    <Skeleton className="h-full rounded-t-md" />
                </AspectRatio>
            </CardHeader>
            <CardContent className="px-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-0" />
            </CardContent>
        </Card>
    );
}
