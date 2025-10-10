import { getCurrentUser, isUserSuperAdmin } from "@/data/auth";
import { notFound } from "next/navigation";

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();
    const permissionToView = await isUserSuperAdmin(user);
    if (!permissionToView) {
        return notFound();
    }
    return <>{children}</>;
}
