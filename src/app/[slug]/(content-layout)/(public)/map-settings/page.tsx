import { MapSettingsDialog } from "@/app/components/dialog/map-settings-dialog";
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
import { TriangleAlert } from "lucide-react";

export default async function MapSettingsPage() {
    return (
        <ContentLayout>
            <Header>
                <HeaderIcon>
                    <TriangleAlert size={80} />
                </HeaderIcon>
                <HeaderContent>
                    <HeaderTitle>Map Settings</HeaderTitle>
                    <HeaderDescription>
                        Configure the map settings to your liking.
                    </HeaderDescription>
                </HeaderContent>
            </Header>
            <ContentLayoutInner>
                <MapSettingsDialog />
            </ContentLayoutInner>
        </ContentLayout>
    );
}
