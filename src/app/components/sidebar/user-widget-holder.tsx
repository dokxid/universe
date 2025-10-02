"use client";

import {
    UserWidgetAuthorized,
    UserWidgetNoAuth,
    UserWidgetNotAuthorized,
} from "@/app/components/cards/user-widgets";
import { useAuth } from "@workos-inc/authkit-nextjs/components";

export function UserWidgetHolder({ slug }: { slug: string }) {
    const { roles, loading, organizationId, user } = useAuth();

    if (loading) return <UserWidgetNoAuth />;

    if (!user) {
        return <UserWidgetNoAuth />;
    }

    console.log("Organization ID:", organizationId);
    if (organizationId === process.env.NEXT_PUBLIC_WORKOS_SUPER_ADMIN_ORG_ID) {
        return (
            <UserWidgetAuthorized
                user={user}
                slug={slug}
                role={"Super Admin"}
            />
        );
    }

    if (slug === "universe") {
        return null;
    }

    if (roles === undefined) {
        return <UserWidgetNotAuthorized slug={slug} />;
    }

    return (
        <UserWidgetAuthorized
            user={user}
            slug={slug}
            role={roles.includes("admin") ? "Admin" : "Editor"}
        />
    );
}
