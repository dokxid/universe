import { DialogSkeleton } from "@/components/modal/dialogSkeleton";
import { ListExperiencesSkeleton } from "@/components/modal/listExperiencesDialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <DialogSkeleton>
            <ListExperiencesSkeleton />
        </DialogSkeleton>
    )
}
