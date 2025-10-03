import ContentLayout from "@/app/components/layout/content-layout";
import { UserPreferencesDialog } from "@/app/components/modal/user-preferences-dialog";

export default async function Page() {
    return (
        <ContentLayout>
            <UserPreferencesDialog />
        </ContentLayout>
    );
}
