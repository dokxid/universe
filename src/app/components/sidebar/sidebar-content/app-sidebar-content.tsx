import { AboutItemGroup } from "@/app/components/sidebar/sidebar-content/about-item-group";
import { AdminItemGroup } from "@/app/components/sidebar/sidebar-content/admin-item-group";
import { EditorItemGroup } from "@/app/components/sidebar/sidebar-content/editor-item-group";
import { LinksItemGroup } from "@/app/components/sidebar/sidebar-content/links-item-group";
import { SuperAdminItemGroup } from "@/app/components/sidebar/sidebar-content/super-admin-item-group";
import { UserItemGroup } from "@/app/components/sidebar/sidebar-content/user-item-group";
import { SidebarContent } from "@/components/ui/sidebar";
import {
    getCurrentUserOptional,
    isUserAdmin,
    isUserMember,
    isUserSuperAdmin,
} from "@/data/auth";
import { User } from "@workos-inc/node";
import { unstable_cache } from "next/cache";

export async function AppSidebarContent({ slug }: { slug: string }) {
    const user = await getCurrentUserOptional();
    const IsSuperAdminCache = unstable_cache(
        async (user: User | null) => {
            return await isUserSuperAdmin(user);
        },
        ["isUserSuperAdmin", user?.id || "null"],
        { revalidate: 300 } // Cache for 5 minutes
    );

    const isMemberCache = unstable_cache(
        async (user: User | null, slug: string) => {
            return await isUserMember(user, slug);
        },
        ["isUserMember", user?.id || "null", slug],
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
    const isEditor = await isMemberCache(user, slug);
    const isAdmin = await IsAdminCache(user, slug);
    const isUniverseView = slug === "universe";

    return (
        <SidebarContent className={"px-1 flex flex-col gap-1"}>
            <UserItemGroup isUniverseView={isUniverseView} />
            {!isUniverseView && <EditorItemGroup visible={isEditor} />}
            {!isUniverseView && <AdminItemGroup visible={isAdmin} />}
            <SuperAdminItemGroup visible={isSuperAdmin} />
            <div className={"flex-grow"}></div>
            <LinksItemGroup isUniverseView={isUniverseView} />
            <AboutItemGroup />
        </SidebarContent>
    );
}
