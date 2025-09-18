import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";
import StoreProvider from "@/app/StoreProvider";
import { AuthKitProvider } from "@workos-inc/authkit-nextjs/components";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DialogProvider } from "@/components/dialog/dialogProvider";

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
    children,
}: Readonly<{
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
                    <DialogProvider/>
                    {children}
                    <Toaster/>
                    </body>
                    </html>
                </TooltipProvider>
            </StoreProvider>
        </AuthKitProvider>
    );
}
