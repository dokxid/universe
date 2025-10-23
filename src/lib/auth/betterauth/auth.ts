import { PrismaClient } from "@/generated/prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { organization } from "better-auth/plugins/organization";

const prisma = new PrismaClient();

const db = prismaAdapter(prisma, { provider: "mongodb" });

export const auth = betterAuth({
    plugins: [
        organization({
            schema: {
                organization: {
                    modelName: "Lab",
                    additionalFields: {
                        center: {
                            type: "json",
                            required: true,
                        },
                        initialZoom: {
                            type: "number",
                            required: true,
                        },
                        subtitle: {
                            type: "string",
                            required: false,
                        },
                        content: {
                            type: "string",
                            required: false,
                        },
                        stories: {
                            type: "json",
                            required: true,
                        },
                        visibility: {
                            type: "string",
                            required: true,
                        },
                    },
                },
            },
        }),
    ],
    user: {
        fields: {
            name: "displayName",
            image: "profilePictureUrl",
        },
        additionalFields: {
            title: { type: "string", required: false },
            name: { type: "string", required: false },
            familyName: { type: "string", required: false },
            position: { type: "string", required: false },
            website: { type: "string", required: false },
            phoneNumber: { type: "string", required: false },
            publicEmail: { type: "string", required: false },
        },
    },
    database: db,
    emailAndPassword: {
        enabled: true,
    },
});
