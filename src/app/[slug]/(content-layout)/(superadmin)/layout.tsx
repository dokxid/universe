import { isUserSuperAdmin } from "@/data/auth";
import { notFound } from "next/navigation";

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const permissionToView = await isUserSuperAdmin();
    if (!permissionToView) {
        return notFound();
    }
    return <>{children}</>;
}
