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
import LabsCreateView from "@/app/components/views/labs-create-view";
import { Earth } from "lucide-react";

export default async function CreateLab() {
    return (
        <ContentLayout>
            <Header>
                <HeaderIcon>
                    <Earth size={80} />
                </HeaderIcon>
                <HeaderContent>
                    <HeaderTitle>Create a new lab</HeaderTitle>
                    <HeaderDescription>
                        Use the form below to create a new lab in the universe.
                    </HeaderDescription>
                </HeaderContent>
            </Header>
            <ContentLayoutInner>
                <LabsCreateView />
            </ContentLayoutInner>
        </ContentLayout>
    );
}
