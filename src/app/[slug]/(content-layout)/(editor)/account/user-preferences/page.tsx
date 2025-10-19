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
import { UserPreferences } from "@/app/components/views/user-preferences";
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
                <UserPreferences />
            </ContentLayoutInner>
        </ContentLayout>
    );
}
