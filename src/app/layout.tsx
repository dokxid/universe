import StoreProvider from "@/app/store-provider";
import { SidebarLayout } from "@/app/components/sidebar/sidebar-wrapper";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthKitProvider } from "@workos-inc/authkit-nextjs/components";
import type { Metadata } from "next";
import React from "react";
import { Toaster } from "sonner";
import "./globals.css";
import { ThemeProvider } from "@/app/components/providers/theme-provider";

type RootLayoutProps = {
    children: React.ReactNode;
    modal?: React.ReactNode;
};

export const metadata: Metadata = {
    title: "Heritage Lab Universe",
    description: "Explore cultures, their history and stories",
};
export default function RootLayout({ children, modal }: RootLayoutProps) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={"antialiased"}
            >
                <AuthKitProvider>
                    <StoreProvider>
                        <TooltipProvider>
                            <main>
                                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                                    <SidebarLayout>
                                        <div>{modal}</div>
                                        <div className="flex grow">{children}</div>
                                        <Toaster />
                                    </SidebarLayout>
                                </ThemeProvider>
                            </main>
                        </TooltipProvider>
                    </StoreProvider>
                </AuthKitProvider>
            </body>
        </html>
    );
}
