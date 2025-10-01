import AddStoryForm from "@/app/components/form/add-story-form";
import { Dialog } from "@/app/components/modal/dialog";
import { getCurrentUser } from "@/data/auth";
import { canUserCreateStory } from "@/data/dto/story-dto";
import { getTagsDTO } from "@/data/dto/tag-dto";

export default async function Page({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const user = await getCurrentUser();
    const tagsPromise = getTagsDTO();
    if (canUserCreateStory(user, "test") === false) {
        return <div>You do not have permission to create a story.</div>;
    }
    return (
        <Dialog
            title="Add Your Story"
            description="Enter your story details below:"
        >
            <AddStoryForm slug={slug} tagsPromise={tagsPromise} />
        </Dialog>
    );
}
