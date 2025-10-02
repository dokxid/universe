import { NavigationBreadcrumbs } from "@/app/components/layout/navigation-breadcrumbs";
import { AppSidebar } from "@/app/components/sidebar/app-sidebar";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export default function ContentLayout({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className="w-full h-full flex">
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 gap-2">
                    <div className="flex items-center gap-5 px-3">
                        <SidebarTrigger />
                        <Breadcrumb>
                            <NavigationBreadcrumbs />
                        </Breadcrumb>
                    </div>
                </header>
                <div
                    className={cn(
                        "flex flex-1 flex-col gap-4 p-4 overflow-y-auto items-center",
                        className
                    )}
                >
                    {children}
                </div>
            </SidebarInset>
        </div>
    );
}
