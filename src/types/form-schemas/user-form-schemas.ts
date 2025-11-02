import { ACCEPTED_IMAGE_TYPES } from "@/types/form-schemas/form-schemas";
import z from "zod";

export const editUserDisplayNameFormSchema = z.object({
    userId: z.string().min(1, "User ID is required."),
    displayName: z
        .string()
        .min(2, "Display name must be at least 2 characters."),
    firstName: z.string().min(2, "First name must be at least 2 characters."),
    lastName: z.string().min(2, "Last name must be at least 2 characters."),
}); export const editUserDetailsFormSchema = z.object({
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

export const inviteSuperAdminFormSchema = z.object({
    email: z.email("Please enter a valid email address."),
});
