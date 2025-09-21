import AddStoryForm from "@/app/components/form/add-story-form";
import ContentLayout from "@/app/components/layout/content-layout";
import { AppSidebar } from "@/app/components/sidebar/app-sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

export default function Page() {
    return (
        <ContentLayout>
            <AddStoryForm />
        </ContentLayout>
    );
}
