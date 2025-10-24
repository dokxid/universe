import { PrismaClient } from "@/generated/prisma/client";
import { sendEmail } from "@/lib/mail";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins/admin";
import { organization } from "better-auth/plugins/organization";

const prisma = new PrismaClient();

const db = prismaAdapter(prisma, { provider: "mongodb" });

function sendOrganizationInvitation(data: {
    email: string;
    invitedByUsername: string;
    invitedByEmail: string;
    teamName: string;
    inviteLink: string;
}) {
    const { email, invitedByUsername, invitedByEmail, teamName, inviteLink } =
        data;

    const subject = `Invitation to join the lab "${teamName}"`;

    const body = `
        <p>Hi,</p>
        <p>${invitedByUsername} (${invitedByEmail}) has invited you to join the lab "<strong>${teamName}</strong>".</p>
        <p>Click the link below to accept the invitation:</p>
        <p><a href="${inviteLink}">Accept Invitation</a></p>
        <p>If you did not expect this invitation, you can safely ignore this email.</p>
        <p>Best regards,<br/>The Universe Team</p>
    `;

    // Here you would integrate with your email sending service
    sendEmail({
        to: email,
        subject,
        html: body,
    });
}

export const auth = betterAuth({
    plugins: [
        admin({}),
        organization({
            async sendInvitationEmail(data) {
                const inviteLink = `http://localhost:3000/auth/accept-invitation/${data.id}`;
                sendOrganizationInvitation({
                    email: data.email,
                    invitedByUsername: data.inviter.user.name,
                    invitedByEmail: data.inviter.user.email,
                    teamName: data.organization.name,
                    inviteLink,
                });
            },
            schema: {
                member: {
                    fields: {
                        organizationId: "labId",
                        organization: "lab",
                    },
                },
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
            firstName: { type: "string", required: false },
            familyName: { type: "string", required: false },
            position: { type: "string", required: false },
            website: { type: "string", required: false },
            phoneNumber: { type: "string", required: false },
            publicEmail: { type: "string", required: false },
            description: { type: "string", required: false },
        },
    },
    database: db,
    emailAndPassword: {
        enabled: true,
    },
    advanced: {
        database: {
            generateId: false,
        },
    },
});
