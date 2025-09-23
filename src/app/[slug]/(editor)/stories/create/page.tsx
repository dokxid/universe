import AddStoryForm from "@/app/components/form/add-story-form";
import ContentLayout from "@/app/components/layout/content-layout";

export default function Page() {
    return (
        <ContentLayout slug={"universe"} feature={"Create story"}>
            <AddStoryForm />
        </ContentLayout>
    );
}
