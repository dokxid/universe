import { auth } from "@/lib/auth/betterauth/auth";

const validateEnv = () => {
    if (
        !process.env.BETTER_AUTH_ADMIN_EMAIL ||
        !process.env.BETTER_AUTH_ADMIN_PASSWORD
    ) {
        throw new Error(
            "BETTER_AUTH_ADMIN_EMAIL and BETTER_AUTH_ADMIN_PASSWORD must be set in environment variables"
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
