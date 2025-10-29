"use client";

import {
    UserWidgetAuthorized,
    UserWidgetNoAuth,
} from "@/app/components/cards/user-widgets";
import { UserWidgetAuthorizedSkeleton } from "@/components/skeletons/user-widget-skeleton";
import { Role } from "@/data/auth";
import { useGetRoleInLab } from "@/lib/swr/user-hook";
import { usePathname } from "next/navigation";

export function UserWidgetHolder() {
    const pathname = usePathname();
    const slug = pathname.split("/")[1];
    const { roleInLab, isLoading, isError } = useGetRoleInLab(slug);

    if (isLoading || isError) return <UserWidgetAuthorizedSkeleton />;

    if (!roleInLab || roleInLab === "guest")
        return <UserWidgetNoAuth slug={slug} />;

    const roleMap: Record<Role, string> = {
        guest: "Guest",
        admin: "Admin",
        editor: "Editor",
        not_authorized: "Not Authorized",
        superadmin: "Super Admin",
    };
    console.log("roleInLab:", roleInLab);

    if (roleInLab === "superadmin") {
        return <UserWidgetAuthorized slug={slug} role={roleMap[roleInLab]} />;
    }

    return (
        <>
            <UserWidgetAuthorized slug={slug} role={roleMap[roleInLab]} />
            {/* <Button
                onClick={() =>
                    mutate(["user", slug], undefined, { revalidate: true })
                }
            >
                revalidate
            </Button> */}
        </>
    );
}
