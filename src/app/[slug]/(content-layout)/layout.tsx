import PageLayout from "@/app/components/layout/page-layout";
import { Impersonation } from "@workos-inc/authkit-nextjs/components";

export default function RootLayout({
    children,
    modal,
}: {
    children: React.ReactNode;
    modal: React.ReactNode;
}) {
    return (
        <PageLayout>
            <Impersonation />
            {children}
            <div>{modal}</div>
        </PageLayout>
    );
}
