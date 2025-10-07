"use client";

import {
    UserWidgetAuthorized,
    UserWidgetNoAuth,
    UserWidgetNotAuthorized,
} from "@/app/components/cards/user-widgets";
import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { useParams } from "next/navigation";
import { useMemo } from "react";

export function UserWidgetHolder() {
    const { slug } = useParams<{ slug: string }>();
    const { roles, loading, organizationId, user } = useAuth();

    const cachedAuthData = useMemo(
        () => ({
            roles,
            loading,
            organizationId,
            user,
        }),
        [roles, loading, organizationId, user]
    );

    if (cachedAuthData.loading) return <UserWidgetNoAuth slug={slug} />;

    if (!cachedAuthData.user) {
        return <UserWidgetNoAuth slug={slug} />;
    }

    if (
        cachedAuthData.organizationId ===
        process.env.NEXT_PUBLIC_WORKOS_SUPER_ADMIN_ORG_ID
    ) {
        return (
            <UserWidgetAuthorized
                user={cachedAuthData.user}
                slug={slug}
                role={"Super Admin"}
            />
        );
    }

    if (cachedAuthData.roles === undefined) {
        return <UserWidgetNotAuthorized slug={slug} />;
    }

    return (
        <UserWidgetAuthorized
            user={cachedAuthData.user}
            slug={slug}
            role={cachedAuthData.roles.includes("admin") ? "Admin" : "Editor"}
        />
    );
}
