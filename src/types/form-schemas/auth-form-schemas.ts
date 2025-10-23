import z from "zod";

export const signUpFormSchema = z
    .object({
        email: z.email(),
        password: z.string().min(8).max(100),
        confirmPassword: z.string().min(8).max(100),
        displayName: z.string().max(50).optional(),
        labSlug: z.string().min(3).max(30),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });
