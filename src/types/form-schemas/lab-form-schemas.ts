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
