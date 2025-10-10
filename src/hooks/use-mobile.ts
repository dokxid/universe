import * as React from "react";
import { useEffect } from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
    const [isMobile, setIsMobile] = React.useState<boolean>(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
        };

        // Check on mount
        checkMobile();

        // Add resize listener
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []); // Empty dependency array is crucial

    return !!isMobile;
}
