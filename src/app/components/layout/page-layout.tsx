import { NavigationBreadcrumbs } from "@/app/components/layout/navigation-breadcrumbs";
import { AppSidebar } from "@/app/components/sidebar/app-sidebar";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export default function PageLayout({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className="w-full h-full flex">
            <AppSidebar />
            <div className={"bg-background relative flex w-full flex-col"}>
                <header className="flex h-16 shrink-0 gap-2 w-full">
                    <div className="relative flex items-center gap-3 px-4 w-full">
                        <SidebarTrigger
                            variant={"sidebar_trigger_custom"}
                            className={"size-10 rounded-md static"}
                        />
                        <Breadcrumb className={"max-w-6xl w-full mx-0 px-0"}>
                            <NavigationBreadcrumbs />
                        </Breadcrumb>
                    </div>
                </header>
                <div
                    className={cn(
                        "flex flex-col gap-4 px-4 overflow-y-auto items-center",
                        className
                    )}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}
