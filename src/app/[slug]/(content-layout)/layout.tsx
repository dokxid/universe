import PageLayout from "@/app/components/layout/page-layout";

export default function RootLayout({
    children,
    modal,
}: {
    children: React.ReactNode;
    modal: React.ReactNode;
}) {
    return (
        <PageLayout>
            {children}
            <div>{modal}</div>
        </PageLayout>
    );
}
