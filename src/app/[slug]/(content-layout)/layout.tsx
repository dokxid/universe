import ContentLayout from "@/app/components/layout/content-layout";
import { Impersonation } from "@workos-inc/authkit-nextjs/components";

export default function RootLayout({
    children,
    modal,
}: {
    children: React.ReactNode;
    modal: React.ReactNode;
}) {
    return (
        <ContentLayout>
            <Impersonation />
            {children}
            <div>{modal}</div>
        </ContentLayout>
    );
}
