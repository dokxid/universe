import { ContentLayout, ContentLayoutInner } from "@/app/components/layout/content-layout";
import {
    Header,
    HeaderContent,
    HeaderDescription,
    HeaderIcon,
    HeaderTitle,
} from "@/app/components/layout/header";
import { HowToStartAHeritageView } from "@/app/components/views/how-to-start-a-heritage-lab-view";
import { BookKey } from "lucide-react";

export default async function HowToStartAHeritagePage() {
    return (
        <>
            <ContentLayout>
                <Header>
                    <HeaderIcon>
                        <BookKey size={80} />
                    </HeaderIcon>
                    <HeaderContent>
                        <HeaderTitle>How to start a Heritage Lab</HeaderTitle>
                        <HeaderDescription>
                            Learn the steps to create your own Heritage Lab
                            and contribute to preserving cultural heritage.
                        </HeaderDescription>
                    </HeaderContent>
                </Header>
                <ContentLayoutInner>
                    <HowToStartAHeritageView />
                </ContentLayoutInner>
            </ContentLayout>
        </>
    );
}
