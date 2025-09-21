import AddStoryForm from "@/app/components/form/add-story-form";
import { Dialog } from "@/app/components/modal/dialog";

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
