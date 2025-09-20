"use client";

import AddStoryForm from "@/components/form/addStoryForm";
import { Dialog } from "@/components/modal/dialog";

export default function Page() {
    return (
        <Dialog
            title="Add Your Story"
            description="Enter your story details below:"
        >
            <AddStoryForm />
        </Dialog>
    );
}
