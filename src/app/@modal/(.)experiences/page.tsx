import { Dialog } from "@/components/modal/dialog";
import { ListExperiencesDialog } from "@/components/modal/listExperiencesDialog";
import { Suspense } from "react";

export default function Page() {
    return (
        <Dialog
            title="Story experiences"
            description="Explore our Co-Labs built story experiences. They have their own seperate website, to customize their experience a bit more."
        >
            <Suspense fallback={<div>Loading...</div>}>
                <ListExperiencesDialog />
            </Suspense>
        </Dialog>
    );
}
