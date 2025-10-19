/**
 * Extracts the lab slug from a given pathname.
 *
 * @param pathname - The URL pathname string (e.g., "/lab-slug/other-segments") you get from calling `usePathname()`.
 * @returns The lab slug, which is the first segment of the pathname after the leading slash.
 */
export const getLabSlugFromPathname = (pathname: string) => {
    return pathname.split("/")[1];
};
