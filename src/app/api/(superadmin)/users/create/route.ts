import { auth } from "@/lib/auth/betterauth/auth";
import { createUserFormSchema } from "@/types/form-schemas/auth-form-schemas";
import { NextRequest } from "next/server";
import z from "zod";

const validateEnv = () => {
    if (
        !process.env.BETTER_AUTH_ADMIN_EMAIL ||
        !process.env.BETTER_AUTH_ADMIN_PASSWORD
    ) {
        throw new Error(
            "BETTER_AUTH_ADMIN_EMAIL and BETTER_AUTH_ADMIN_PASSWORD must be set in environment variables",
        );
    }
    return {
        email: process.env.BETTER_AUTH_ADMIN_EMAIL,
        password: process.env.BETTER_AUTH_ADMIN_PASSWORD,
    };
};

export async function GET() {
    const { email, password } = validateEnv();
    const admin = await auth.api.createUser({
        body: {
            email,
            password,
            name: "Anonymous",
            role: "admin",
        },
    });
    return new Response(`Admin user created with ID: ${admin.user.id}`);
}

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const rawData = Object.fromEntries(formData.entries());
    const result = createUserFormSchema.safeParse(rawData);
    if (!result.success) {
        throw new Error(JSON.stringify(z.flattenError(result.error)));
    }
    const data = result.data;
    const user = await auth.api.createUser({
        body: {
            email: data.email,
            password: data.password,
            name: data.name ?? "Anonymous",
        },
    });
    return new Response(`Admin user created with ID: ${user.user.id}`);
}
