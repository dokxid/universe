import {
    ACCEPTED_IMAGE_TYPES,
    LAB_VISIBILITY_OPTIONS,
} from "@/types/form-schemas/form-schemas";
import z from "zod";

export const editLabAppearanceSchema = z.object({
    lab: z.string().min(1, "Lab slug is required."),
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
});

export const editLabImageFormSchema = z.object({
    lab: z.string().min(1, "Lab slug is required."),
    image: z
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

export const editVisibilityFormSchema = z.object({
    lab: z.string().min(1, "Slug is required"),
    visibility: z.enum(LAB_VISIBILITY_OPTIONS),
});

export const createLabFormSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters."),
    subtitle: z.string().min(2, "Subtitle must be at least 2 characters."),
    content: z.string().min(10, "Content must be at least 10 characters."),
    slug: z
        .string()
        .min(3, "Subdomain slug must be at least 3 characters.")
        .regex(
            /^[a-zA-Z0-9-]+$/,
            "Subdomain can only contain letters, numbers, and hyphens."
        ),
    visibility: z.enum(LAB_VISIBILITY_OPTIONS),
    longitude: z.number().refine((value) => value >= -180 && value <= 180, {}),
    latitude: z.number().refine((value) => value >= -90 && value <= 90, {}),
    initialZoom: z.number().refine((value) => value >= 0 && value <= 22, {}),
    adminEmail: z.email("Please enter a valid email address."),
    image: z
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

export const inviteLabAdminFormSchema = z.object({
    email: z.email("Please enter a valid email address."),
    lab: z.string().min(1, "Lab slug is required."),
});
