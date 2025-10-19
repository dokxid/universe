import { isUserAdmin } from "@/data/auth";
import { notFound } from "next/navigation";

export default async function RootLayout({
    params,
    children,
}: {
    params: Promise<{ slug: string }>;
    children: React.ReactNode;
}) {
    const { slug } = await params;
    const permissionToView = await isUserAdmin(slug);
    if (!permissionToView) {
        return notFound();
    }
    return <>{children}</>;
}
