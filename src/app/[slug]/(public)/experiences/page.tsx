import { ListExperiencesDialog } from "@/app/components/modal/list-experiences-dialog";
import { AppSidebar } from "@/app/components/sidebar/app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { Sidebar } from "lucide-react";

export default function ExperiencesPage() {
    return (
        <div className="w-full h-full flex">
            <AppSidebar />
            <SidebarInset>
                
            <div className="flex-1 p-4">
                <ListExperiencesDialog />
            </div>
            </SidebarInset>
        </div>
    );
}
