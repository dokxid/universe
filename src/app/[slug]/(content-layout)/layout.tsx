import PageLayout from "@/app/components/layout/page-layout";

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <PageLayout>{children}</PageLayout>;
}
