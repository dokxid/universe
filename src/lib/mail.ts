import nodemailer from "nodemailer";

enum EmailMode {
    EMAIL = "email",
    CONSOLE = "console",
}

function isEmailMode(mode: string): mode is EmailMode {
    return mode === EmailMode.CONSOLE || mode === EmailMode.EMAIL;
}

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || "465", 10),
    secure: true, // Use true for port 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER, // Authentication user
        pass: process.env.EMAIL_PASS, // Authentication password
    },
});

export async function sendEmail({
    to,
    subject,
    html,
}: {
    to: string;
    subject: string;
    html: string;
}) {
    try {
        if (isEmailMode(process.env.EMAIL_MODE || "") === false) {
            throw new Error("EMAIL_MODE is not set correctly");
        }
        if (process.env.EMAIL_MODE === EmailMode.CONSOLE) {
            console.log("Email Mode: Console");
            console.log(`To: ${to}`);
            console.log(`Subject: ${subject}`);
            console.log(`HTML: ${html}`);
            return;
        }
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM, // Sender email address
            to, // Recipient email address
            subject, // Email subject
            html, // Email body
        });
        console.log(`Email sent: ${info.messageId}`);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send email");
    }
}
