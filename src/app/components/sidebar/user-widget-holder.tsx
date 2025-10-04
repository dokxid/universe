"use client";

import {
    UserWidgetAuthorized,
    UserWidgetNoAuth,
    UserWidgetNotAuthorized,
} from "@/app/components/cards/user-widgets";
import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { useParams } from "next/navigation";

export function UserWidgetHolder() {
    const { slug } = useParams<{ slug: string }>();
    const { roles, loading, organizationId, user } = useAuth();

    if (loading) return <UserWidgetNoAuth />;

    if (!user) {
        return <UserWidgetNoAuth />;
    }

    if (organizationId === process.env.NEXT_PUBLIC_WORKOS_SUPER_ADMIN_ORG_ID) {
        return (
            <UserWidgetAuthorized
                user={user}
                slug={slug}
                role={"Super Admin"}
            />
        );
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
