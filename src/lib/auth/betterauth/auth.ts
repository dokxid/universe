import { prisma } from "@/lib/data/prisma/connections";
import { sendEmail } from "@/lib/mail";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins/admin";
import { organization } from "better-auth/plugins/organization";

const db = prismaAdapter(prisma, { provider: "postgresql" });

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

function sendPasswordResetEmail(data: {
    email: string;
    resetLink: string;
}) {
    const { email, resetLink } = data;
    const subject = "Password Reset Request";
    const body = `
        <p>Hi,</p>
        <p>We received a request to reset your password.</p>
        <p>Click the link below to reset your password:</p>
        <p><a href="${resetLink}">Reset Password</a></p>
        <p>If you did not request a password reset, you can safely ignore this email.</p>
        <p>Best regards,<br/>The Universe Team</p>
    `;
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
                invitation: {
                    fields: {
                        organizationId: "labId",
                        organization: "lab",
                    },
                },
                organization: {
                    modelName: "Lab",
                    additionalFields: {
                        lngCenter: {
                            type: "number",
                            required: true,
                        },
                        latCenter: {
                            type: "number",
                            required: true,
                        },
                        initialZoom: {
                            type: "number",
                            required: true,
                        },
                        subtitle: {
                            type: "string",
                            required: true,
                        },
                        content: {
                            type: "string",
                            required: true,
                        },
                        stories: {
                            type: "json",
                            required: false,
                            input: false,
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
        sendResetPassword: async ({ user, url }) => {
            sendPasswordResetEmail({
                email: user.email,
                resetLink: url,
            });
        },
    },
    advanced: {
        database: {
            generateId: false,
        },
    },
});
