import { ContentLayout, ContentLayoutInner } from "@/app/components/layout/content-layout";
import {
    Header,
    HeaderContent,
    HeaderDescription,
    HeaderIcon,
    HeaderTitle,
} from "@/app/components/layout/header";
import { PrivacyPolicyView } from "@/app/components/views/privacy-policy-view";
import { BookKey } from "lucide-react";

export default async function PrivacyPage() {
    return (
        <>
            <ContentLayout>
                <Header>
                    <HeaderIcon>
                        <BookKey size={80} />
                    </HeaderIcon>
                    <HeaderContent>
                        <HeaderTitle>Privacy Policy</HeaderTitle>
                        <HeaderDescription>
                            Your privacy is important to us. This policy
                            outlines how we collect, use, and protect your
                            information.
                        </HeaderDescription>
                    </HeaderContent>
                </Header>
                <ContentLayoutInner>
                    <PrivacyPolicyView />
                </ContentLayoutInner>
            </ContentLayout>
        </>
    );
}
