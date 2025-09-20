import StoreProvider from "@/app/StoreProvider";
import { SidebarLayout } from "@/app/components/sidebar/sidebarWrapper";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthKitProvider } from "@workos-inc/authkit-nextjs/components";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import React from "react";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

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
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <AuthKitProvider>
                    <StoreProvider>
                        <TooltipProvider>
                            <main>
                                <SidebarLayout>
                                    <div>{modal}</div>
                                    <div className="flex grow">{children}</div>
                                    <Toaster />
                                </SidebarLayout>
                            </main>
                        </TooltipProvider>
                    </StoreProvider>
                </AuthKitProvider>
            </body>
        </html>
    );
}
