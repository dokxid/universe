import {DialogSkeleton} from "@/app/components/modal/dialogSkeleton";
import {ListExperiencesSkeleton} from "@/app/components/modal/listExperiencesDialog";

export default function Loading() {
    return (
        <DialogSkeleton>
            <ListExperiencesSkeleton/>
        </DialogSkeleton>
    )
}
