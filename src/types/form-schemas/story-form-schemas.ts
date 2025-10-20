import { CC_LICENSES } from "@/types/dtos";
import { ACCEPTED_IMAGE_TYPES } from "@/types/form-schemas/form-schemas";
import z from "zod";

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

export const editFeaturedPictureFormSchema = z.object({
    featuredPicture: z
        .file()
        .min(1, "Please upload a file.")
        .max(5 * 1024 * 1024, "Max file size is 5MB.")
        .mime(ACCEPTED_IMAGE_TYPES, "Only .jpg and .png files are accepted."),
    storyId: z.string().min(1, "Story ID is required"),
    lab: z.string().min(1, "Lab is required"),
});
