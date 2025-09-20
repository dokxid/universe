"use client";

import AddStoryForm from "@/app/components/form/addStoryForm";
import {Dialog} from "@/app/components/modal/dialog";

export default function Page() {
    return (
        <Dialog
            title="Add Your Story"
            description="Enter your story details below:"
        >
            <AddStoryForm/>
        </Dialog>
    );
}
