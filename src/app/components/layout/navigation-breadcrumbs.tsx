"use client";

import {
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { pathFeatures } from "@/lib/path";
import { usePathname } from "next/navigation";

export function NavigationBreadcrumbs() {
    const pathname = usePathname();
    const pathSegments = pathname.split("/").filter((segment) => segment);
    const slug = pathSegments[0] || "N/A";
    const feature = pathFeatures.get(pathSegments[1]) || "N/A";
    if (pathSegments[2] === "view" || pathSegments[2] === "edit") {
        pathSegments[2] = "Story Details";
    }

    return (
        <BreadcrumbList className={"max-w-full"}>
            <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href={`/${slug}`}>{slug}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
                <BreadcrumbPage>{feature}</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
                <BreadcrumbPage>{pathSegments[2]}</BreadcrumbPage>
            </BreadcrumbItem>
        </BreadcrumbList>
    );
}
