export const buildAvatarFallbackString = (name: string) => {
    if (name.trim().length === 0) {
        throw new Error(
            `Cannot build avatar fallback string from empty name: original: "${name}, trimmed: "${name.trim()}"`
        );
    }
    const nameParts = name.trim().split(" ");
    if (nameParts.length >= 2) {
        // case 1: first and last name available: only display 2 initials at most
        return (
            nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)
        );
    }
    // case 2: only 1 name available
    return name.charAt(0);
};
