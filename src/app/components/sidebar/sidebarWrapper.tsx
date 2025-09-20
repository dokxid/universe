import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";

interface SidebarLayoutProps {
    children: ReactNode;
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
    return (
        <SidebarProvider className="relative flex flex-row h-screen w-screen">
            {children}
        </SidebarProvider>
    );
}
