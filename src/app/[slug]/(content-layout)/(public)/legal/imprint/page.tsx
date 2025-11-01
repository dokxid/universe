import { ContentLayout, ContentLayoutInner } from "@/app/components/layout/content-layout";
import {
    Header,
    HeaderContent,
    HeaderDescription,
    HeaderIcon,
    HeaderTitle,
} from "@/app/components/layout/header";
import { ImprintView } from "@/app/components/views/imprint-view";
import { BookKey } from "lucide-react";

export default async function ImprintPage() {
    return (
        <>
            <ContentLayout>
                <Header>
                    <HeaderIcon>
                        <BookKey size={80} />
                    </HeaderIcon>
                    <HeaderContent>
                        <HeaderTitle>Imprint</HeaderTitle>
                        <HeaderDescription>
                            This imprint provides essential information about
                            our organization, including legal details and
                            contact information.
                        </HeaderDescription>
                    </HeaderContent>
                </Header>
                <ContentLayoutInner>
                    <ImprintView />
                </ContentLayoutInner>
            </ContentLayout>
        </>
    );
}
