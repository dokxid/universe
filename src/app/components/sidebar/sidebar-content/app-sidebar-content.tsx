import { AboutItemGroup } from "@/app/components/sidebar/sidebar-content/about-item-group";
import { AdminItemGroup } from "@/app/components/sidebar/sidebar-content/admin-item-group";
import { EditorItemGroup } from "@/app/components/sidebar/sidebar-content/editor-item-group";
import { LinksItemGroup } from "@/app/components/sidebar/sidebar-content/links-item-group";
import {
    UserItemGroup,
    UniverseItemGroup,
} from "@/app/components/sidebar/sidebar-content/user-item-group";
import { SidebarContent } from "@/components/ui/sidebar";
import { getCurrentUserOptional, isUserAdmin, isUserMember } from "@/data/auth";

export async function AppSidebarContent({ slug }: { slug: string }) {
    const user = await getCurrentUserOptional();
    const isEditor = await isUserMember(user, slug);
    const isAdmin = await isUserAdmin(user, slug);
    return (
        <SidebarContent className={"px-1"}>
            <UserItemGroup />
            <EditorItemGroup visible={isEditor} />
            <AdminItemGroup visible={isAdmin} />
            <UniverseItemGroup />
            <LinksItemGroup />
            <AboutItemGroup />
        </SidebarContent>
    );
}
