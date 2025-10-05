import { ThemeProvider } from "@/app/components/providers/theme-provider";
import { SidebarLayout } from "@/app/components/sidebar/sidebar-wrapper";
import StoreProvider from "@/app/store-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SpeedInsights } from "@vercel/speed-insights/next";
import {
    AuthKitProvider,
    Impersonation,
} from "@workos-inc/authkit-nextjs/components";
import type { Metadata } from "next";
import React from "react";
import { Toaster } from "sonner";
import "./globals.css";

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
            <head>
                <link rel="icon" href="/img/favicon.ico" sizes="any" />
            </head>
            <body className={"antialiased"}>
                <main>
                    <AuthKitProvider>
                        <StoreProvider>
                            <TooltipProvider>
                                <ThemeProvider
                                    attribute="class"
                                    defaultTheme="system"
                                    enableSystem
                                    disableTransitionOnChange
                                >
                                    <SidebarLayout>
                                        <Impersonation />
                                        <div className="flex grow">
                                            {children}
                                        </div>
                                        <div>{modal}</div>
                                        <Toaster />
                                        <SpeedInsights />
                                    </SidebarLayout>
                                </ThemeProvider>
                            </TooltipProvider>
                        </StoreProvider>
                    </AuthKitProvider>
                </main>
            </body>
        </html>
    );
}
