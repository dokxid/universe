import { CC_LICENSES } from "@/types/dtos";
import { z } from "zod";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];

export const submitStoryFormSchema = z.object({
    title: z.string().min(1, { message: "This field is required" }),
    content: z.string().min(1, { message: "This field is required" }),
    year: z.coerce
        .number<number>()
        .refine((value) => value >= -2000 && value <= 2100, {}),
    longitude: z.coerce
        .number()
        .refine((value) => value >= -180 && value <= 180, {}),
    latitude: z.coerce
        .number()
        .refine((value) => value >= -90 && value <= 90, {}),
    tags: z.array(z.string()),
    draft: z.boolean(),
    universe: z.boolean(),
    slug: z.string().min(1, { message: "This field is required" }),
    license: z.string().min(1, { message: "License is required" }),
    featuredPicture: z
        .file()
        .min(1, "Please upload a file.")
        .max(5 * 1024 * 1024, "Max file size is 5MB.")
        .mime(ACCEPTED_IMAGE_TYPES, "Only .jpg and .png files are accepted."),
});

export const editVisibilityAndLicensingFormSchema = z.object({
    storyId: z.string().min(1, { message: "This field is required" }),
    license: z.enum(Object.values(CC_LICENSES).map((license) => license.code)),
    draft: z.boolean(),
});

export const editStoryCoordinatesFormSchema = z.object({
    storyId: z.string().min(1, { message: "This field is required" }),
    longitude: z.number().refine((value) => value >= -180 && value <= 180, {}),
    latitude: z.number().refine((value) => value >= -90 && value <= 90, {}),
});

export const editStoryFormSchema = z.object({
    storyId: z.string().min(1, { message: "This field is required" }),
    title: z.string().min(1, { message: "This field is required" }),
    year: z.coerce
        .number<number>()
        .refine((value) => value >= -2000 && value <= 2100, {}),
    tags: z.array(z.string()),
});

export const editContentFormSchema = z.object({
    storyId: z.string().min(1, { message: "This field is required" }),
    content: z.string().min(1, { message: "This field is required" }),
});

export const teamSettingsFormSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters."),
    subtitle: z.string().min(2, "Subtitle must be at least 2 characters."),
    description: z
        .string()
        .min(10, "Description must be at least 10 characters."),
    subdomain: z
        .string()
        .min(3, "Subdomain must be at least 3 characters.")
        .regex(
            /^[a-zA-Z0-9-]+$/,
            "Subdomain can only contain letters, numbers, and hyphens."
        ),
    "featured-picture": z
        .any()
        .refine((files) => files?.length === 1, "Please upload a file.")
        .refine((files) => files?.[0]?.size <= 5000000, "Max file size is 5MB.")
        .refine(
            (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
            "Only .jpg and .png files are accepted."
        ),
});

export const editUserDisplayNameFormSchema = z.object({
    userId: z.string().min(1, "User ID is required."),
    displayName: z
        .string()
        .min(2, "Display name must be at least 2 characters."),
    firstName: z.string().min(2, "First name must be at least 2 characters."),
    lastName: z.string().min(2, "Last name must be at least 2 characters."),
});

export const editUserDetailsFormSchema = z.object({
    userId: z.string().min(1, "User ID is required."),
    publicEmail: z
        .union([z.email(), z.literal("")])
        .optional()
        .nullable(),
    position: z.string().optional().nullable(),
    phoneNumber: z.string().optional().nullable(),
    website: z
        .union([z.url(), z.literal("")])
        .optional()
        .nullable(),
    description: z.string().optional().nullable(),
});

export const editUserProfilePictureFormSchema = z.object({
    userId: z.string().min(1, "User ID is required."),
    profilePicture: z
        .any()
        .optional()
        .refine((file) => file instanceof File, "Please upload a file.")
        .refine(
            (file) => file?.size <= 5 * 1024 * 1024,
            "Max file size is 5MB."
        )
        .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
            "Only .jpg and .png files are accepted."
        ),
});

export const inviteMemberSchema = z.object({
    email: z.email("Please enter a valid email address"),
    slug: z.string().min(1),
});

export const editProfilePictureFormSchema = z.object({
    featuredPicture: z
        .file()
        .min(1, "Please upload a file.")
        .max(5 * 1024 * 1024, "Max file size is 5MB.")
        .mime(ACCEPTED_IMAGE_TYPES, "Only .jpg and .png files are accepted."),
    storyId: z.string().min(1, "Story ID is required"),
    lab: z.string().min(1, "Lab is required"),
});
