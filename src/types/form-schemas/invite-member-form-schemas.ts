import z from "zod";

export const inviteMemberSchema = z.object({
    email: z.email("Please enter a valid email address"),
    slug: z.string().min(1),
});
