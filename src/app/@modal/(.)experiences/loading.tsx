import { DialogSkeleton } from "@/components/skeletons/dialog-skeleton";
import { ListExperiencesSkeleton } from "@/components/skeletons/list-experiences-skeleton";

export default function Loading() {
    return (
        <DialogSkeleton>
            <ListExperiencesSkeleton />
        </DialogSkeleton>
    );
}
