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
import { DebugSettings } from "@/app/components/views/debug-settings";
import { TriangleAlert } from "lucide-react";

export default async function Page() {
    return (
        <ContentLayout>
            <Header>
                <HeaderIcon>
                    <TriangleAlert size={80} />
                </HeaderIcon>
                <HeaderContent>
                    <HeaderTitle>Debug Settings</HeaderTitle>
                    <HeaderDescription>
                        <b className={"text-destructive"}>Be careful</b> when
                        using these settings. They are meant for debugging
                        purposes only and can cause data loss.
                    </HeaderDescription>
                </HeaderContent>
            </Header>
            <ContentLayoutInner>
                <DebugSettings />
            </ContentLayoutInner>
        </ContentLayout>
    );
}
