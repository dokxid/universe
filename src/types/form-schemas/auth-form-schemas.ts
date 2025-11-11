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

export const loginFormSchema = z.object({
    email: z.email(),
    password: z.string().min(8).max(100),
    slug: z.string().min(3).max(30),
    rememberMe: z.coerce.boolean().optional(),
});

export const resetPasswordFormSchema = z.object({
    password: z.string().min(8).max(100),
    confirmPassword: z.string().min(8).max(100),
    token: z.string().min(1),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
})

export const changePasswordFormSchema = z.object({
    password: z.string().min(8).max(100),
    newPassword: z.string().min(8).max(100),
})

// Form schema for creating a new user (admin use only)
export const createUserFormSchema = z.object({
    email: z.email("Invalid email address."),
    password: z.string().min(8, "Password must be at least 8 characters.").max(100, "Password must be at most 100 characters."),
    name: z.string().max(50, "Name must be at most 50 characters.").optional(),
})
