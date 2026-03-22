import { Resend } from "resend";

type SendEmailParams = {
    to: string;
    subject: string;
    html: string;
};

export const sendEmail = async ({
                                    to,
                                    subject,
                                    html
                                }: SendEmailParams): Promise<void> => {
    const resendApiKey = process.env.RESEND_API_KEY;
    const mailFrom = process.env.MAIL_FROM;

    if (!resendApiKey) {
        throw new Error("RESEND_API_KEY is not defined in environment variables");
    }

    if (!mailFrom) {
        throw new Error("MAIL_FROM is not defined in environment variables");
    }

    const resend = new Resend(resendApiKey);

    const { error } = await resend.emails.send({
        from: mailFrom,
        to: [to],
        subject,
        html
    });

    if (error) {
        throw new Error(error.message || "Failed to send email");
    }
};