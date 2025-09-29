"use client";

import { SidebarHeader } from "@/components/ui/sidebar";
import { ImageProps } from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type Props = Omit<ImageProps, "src" | "priority" | "loading" | "alt"> & {
    srcLight: string;
    srcDark: string;
};
const ThemeImage = (props: Props) => {
    const { srcLight, srcDark, ...rest } = props;
    const { theme, systemTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null; // Prevent hydration mismatch
    }

    const currentTheme = theme === "system" ? systemTheme : theme;
    const src = currentTheme === "dark" ? srcDark : srcLight;
    const alt =
        currentTheme === "dark" ? "Dark Theme Logo" : "Light Theme Logo";

    // eslint-disable-next-line @next/next/no-img-element -- bc this is an svg we use <img>
    return <img {...rest} src={src} alt={alt} />;
};

export function UniverseHeader() {
    return (
        <SidebarHeader className="px-4 py-4">
            <Button className={"w-full relative h-[80px]"} variant={"ghost"}>
                <ThemeImage
                    srcLight="/img/logotype_normal.svg"
                    srcDark="/img/logotype_white.svg"
                    width={160}
                    height={40}
                    className="object-contain"
                />
            </Button>
        </SidebarHeader>
    );
}
