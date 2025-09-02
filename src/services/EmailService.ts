import nodemailer from 'nodemailer';

export class EmailService {
  private transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  async sendVerificationEmail(email: string, verificationLink: string): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.FROM_EMAIL || process.env.MAIL_USER,
      to: email,
      subject: 'Verify your email address',
      html: `<p>Click <a href="${verificationLink}">here</a> to verify your email. Link expires in 5 minutes.</p>`
    });
  }
}