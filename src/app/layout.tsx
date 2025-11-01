import { ThemeProvider } from "@/app/components/providers/theme-provider";
import { SidebarLayout } from "@/app/components/sidebar/sidebar-wrapper";
import StoreProvider from "@/app/store-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { Metadata } from "next";
import React from "react";
import { Toaster } from "sonner";
import "./globals.css";

type RootLayoutProps = {
    children: React.ReactNode;
};

export const metadata: Metadata = {
    title: "Heritage Lab Universe",
    description: "Explore cultures, their history and stories",
};
export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="icon" href="/img/favicon.ico" sizes="any" />
            </head>
            <body className={"antialiased"}>
                <main>
                    <StoreProvider>
                        <TooltipProvider>
                            <ThemeProvider
                                attribute="class"
                                defaultTheme="system"
                                enableSystem
                                disableTransitionOnChange
                            >
                                <SidebarLayout>
                                    {children}
                                    <Toaster />
                                </SidebarLayout>
                            </ThemeProvider>
                        </TooltipProvider>
                    </StoreProvider>
                </main>
            </body>
        </html>
    );
}
