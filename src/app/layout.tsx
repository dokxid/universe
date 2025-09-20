import StoreProvider from "@/app/StoreProvider";
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

export const metadata: Metadata = {
    title: "Heritage Lab Universe",
    description: "Explore cultures, their history and stories",
};

export default async function RootLayout({
    modal,
    children,
}: Readonly<{
    modal: React.ReactNode;
    children: React.ReactNode;
}>) {
    return (
        <AuthKitProvider>
            <StoreProvider>
                <TooltipProvider>
                    <html lang="en" suppressHydrationWarning>
                        <body
                            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                        >
                            <main>
                                <div>{modal}</div>
                                <div>{children}</div>
                            </main>
                            <Toaster />
                        </body>
                    </html>
                </TooltipProvider>
            </StoreProvider>
        </AuthKitProvider>
    );
}
