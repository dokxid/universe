import {
    ContentLayout,
    ContentLayoutInner,
} from "@/app/components/layout/content-layout";
import {
    Header,
    HeaderContent,
    HeaderDescription,
    HeaderIcon,
    HeaderTitle,
} from "@/app/components/layout/header";
import { UserPreferencesDialog } from "@/app/components/modal/user-preferences-dialog";
import { User } from "lucide-react";

export default async function Page() {
    return (
        <ContentLayout>
            <Header>
                <HeaderIcon>
                    <User size={80} />
                </HeaderIcon>
                <HeaderContent>
                    <HeaderTitle>User Preferences</HeaderTitle>
                    <HeaderDescription>
                        Configure the map settings to your liking.
                    </HeaderDescription>
                </HeaderContent>
            </Header>
            <ContentLayoutInner>
                <UserPreferencesDialog />
            </ContentLayoutInner>
        </ContentLayout>
    );
}
