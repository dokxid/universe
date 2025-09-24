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
import { cn } from "@/lib/utils";

export default function ContentLayout({
    slug,
    feature,
    children,
    className,
}: {
    slug: string;
    feature: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className="w-full h-full flex">
            <AppSidebar slug={slug} />
            <SidebarInset>
                <header className="flex h-16 shrink-0 gap-2 border-b">
                    <div className="flex items-center gap-2 px-3">
                        <SidebarTrigger />
                        <Separator
                            orientation="vertical"
                            className="mr-2 h-4"
                        />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href={`/${slug}`}>
                                        {slug}
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{feature}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
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
