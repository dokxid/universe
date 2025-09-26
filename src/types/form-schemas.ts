import { z } from "zod";

export const submitStoryFormSchema = z.object({
    title: z.string().min(1, { message: "This field is required" }),
    content: z.string().min(1, { message: "This field is required" }),
    year: z.coerce
        .number<number>()
        .refine((value) => value >= 0 && value <= 2100, {}),
    longitude: z.number().refine((value) => value >= -180 && value <= 180, {}),
    latitude: z.number().refine((value) => value >= -90 && value <= 90, {}),
    tags: z.array(z.string()),
    draft: z.boolean(),
    experience: z.string(),
});
