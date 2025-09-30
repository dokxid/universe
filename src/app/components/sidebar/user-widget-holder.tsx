import {
    UserWidgetAuthorized,
    UserWidgetNoAuth,
    UserWidgetNotAuthorized,
} from "@/app/components/cards/user-widgets";
import {
    getCurrentUserOptional,
    isUserAdmin,
    isUserPartOfOrganization,
    isUserSuperAdmin,
} from "@/data/auth";
import { User } from "@workos-inc/node";
import { unstable_cache } from "next/cache";

export async function UserWidgetHolder({ slug }: { slug: string }) {
    const user = await getCurrentUserOptional();
    const IsSuperAdminCache = unstable_cache(
        async (user: User | null) => {
            return await isUserSuperAdmin(user);
        },
        ["isUserSuperAdmin", user?.id || "null"],
        { revalidate: 300 } // Cache for 5 minutes
    );

    const isPartOfOrganizationCache = unstable_cache(
        async (user: User | null, slug: string) => {
            return await isUserPartOfOrganization(user, slug);
        },
        ["isUserPartOfOrganization", user?.id || "null", slug],
        { revalidate: 300 } // Cache for 5 minutes
    );

    const IsAdminCache = unstable_cache(
        async (user: User | null, slug: string) => {
            return await isUserAdmin(user, slug);
        },
        ["isUserAdmin", user?.id || "null", slug],
        { revalidate: 300 } // Cache for 5 minutes
    );

    const isSuperAdmin = await IsSuperAdminCache(user);
    const isPartOfOrganization = await isPartOfOrganizationCache(user, slug);
    const isAdmin = await IsAdminCache(user, slug);

    if (isSuperAdmin) {
        return (
            <UserWidgetAuthorized
                user={user!}
                slug={slug}
                role={"Super Admin"}
            />
        );
    }

    if (slug === "universe") {
        return null;
    }

    if (!user) {
        return <UserWidgetNoAuth />;
    }

    if (!isPartOfOrganization) {
        return <UserWidgetNotAuthorized slug={slug} />;
    }

    return (
        <UserWidgetAuthorized
            user={user}
            slug={slug}
            role={isAdmin ? "Admin" : "Editor"}
        />
    );
}
