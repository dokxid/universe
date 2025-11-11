"use client";

import {
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Earth, Orbit } from "lucide-react";
import { usePathname } from "next/navigation";

export const pathFeatures = new Map<string, string>([
    ["map", "Map"],
    ["stories", "Story collection"],
    ["team", "Team"],
    ["about", "About"],
    ["labs", "Heritage Labs"],
    ["map-settings", "Map settings"],
    ["user-preferences", "User preferences"],
    ["debug-settings", "Debug settings"],
    ["elevation-requests", "Elevation requests"],
    ["contact", "Contact"],
    ["labs", "Heritage Labs"],
    ["login", "Login"],
]);

export function NavigationBreadcrumbs() {
    const pathname = usePathname();
    const pathSegments = pathname.split("/").filter((segment) => segment);
    const slug = pathSegments[0] || "N/A";
    const feature = pathFeatures.get(pathSegments[1]) || "N/A";

    return (
        <BreadcrumbList className={"max-w-full"}>
            <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href={`/${slug}`}>
                    <div className={"flex flex-row items-center gap-2"}>
                        {slug === "universe" ? <Orbit /> : <Earth />}
                        {slug === "universe" ? "" : `/ ${slug}`}
                    </div>
                </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
                <BreadcrumbPage>{feature}</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
                <BreadcrumbPage className={"capitalize"}>
                    {pathSegments[2]}
                </BreadcrumbPage>
            </BreadcrumbItem>
        </BreadcrumbList>
    );
}
