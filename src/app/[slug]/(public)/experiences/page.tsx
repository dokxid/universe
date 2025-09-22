import { ListExperiencesDialog } from "@/app/components/modal/list-experiences-dialog";
import { AppSidebar } from "@/app/components/sidebar/app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";

export default async function ExperiencesPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    return (
        <div className="w-full h-full flex">
            <AppSidebar slug={slug} />
            <SidebarInset>
                <div className="flex-1 p-4">
                    <ListExperiencesDialog />
                </div>
            </SidebarInset>
        </div>
    );
}
