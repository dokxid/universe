import { getCurrentUser, isUserAdmin, isUserSuperAdmin } from "@/data/auth";
import { notFound } from "next/navigation";

export default async function RootLayout({
    params,
    children,
}: {
    params: Promise<{ slug: string }>;
    children: React.ReactNode;
}) {
    const { slug } = await params;
    await getCurrentUser();
    const permissionToView =
        (await isUserSuperAdmin()) || (await isUserAdmin(slug));
    if (!permissionToView) {
        // console.log("Access denied to lab admin layout for slug:", slug);
        return notFound();
    }
    return <>{children}</>;
}
