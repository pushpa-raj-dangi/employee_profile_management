import { Service } from "typedi";
import nodemailer from "nodemailer";
import { EmailOptions } from "../types/emailOptions";

@Service()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "Zoho",
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      ignoreTLS: true,
      requireTLS: false,

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: true,
      },
    });
  }

  async sendMail(options: EmailOptions): Promise<void> {
    const { to, subject, text, html } = options;

    try {
      await this.transporter.sendMail({
        from: `"EMS System" <${process.env.EMAIL_USER || process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        html,
      });
      console.log(`📧 Email sent to ${to}`);
    } catch (error) {
      console.error(`❌ Failed to send email to ${to}:`, error);
      throw new Error("Failed to send email");
    }
  }

  async sendInvitationEmail(
    to: string,
    tempPassword: string,
    token: string
  ): Promise<void> {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:4200";
    const subject = "You're Invited to Join the Employee Management System";
    const text = `
      You've been invited to join our system.
      Temporary password: ${tempPassword}
      Click here to register: ${frontendUrl}/register?token=${token}
    `;
    const html = `
      <p>You've been invited to join our system.</p>
      <p><strong>Temporary password:</strong> ${tempPassword}</p>
      <p><a href="${frontendUrl}/register?token=${token}">Click here to register</a></p>
    `;

    await this.sendMail({ to, subject, text, html });
  }
}
