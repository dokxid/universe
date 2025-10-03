import { useTheme } from "next-themes";
import { ImageProps } from "next/image";
import { useEffect, useState } from "react";

type Props = Omit<ImageProps, "src" | "priority" | "loading" | "alt"> & {
    srcLight: string;
    srcDark: string;
};

export const ThemeImage = (props: Props) => {
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
