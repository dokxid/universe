export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];
export const LAB_VISIBILITY_OPTIONS = [
    "public",
    "unlisted",
    "private",
] as const;
export type LAB_VISIBILITY_OPTIONS = "public" | "unlisted" | "private";
