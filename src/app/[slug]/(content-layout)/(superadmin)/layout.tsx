import { getCurrentUser, isUserSuperAdmin } from "@/data/auth";
import { notFound } from "next/navigation";

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    await getCurrentUser();
    const permissionToView = await isUserSuperAdmin();
    if (!permissionToView) {
        return notFound();
    }
    return <>{children}</>;
}
