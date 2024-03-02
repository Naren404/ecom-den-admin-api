
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async(email) => {
  try {
    const result = await transporter.sendMail(email)

    console.log("Message sent", result?.messageId);
  } catch (error) {
    console.log("Email Error:", error);
  }
}

export const sendVerificationLinkEmail = (user, verificationUrl) => {
  const { email, firstName, lastName } = user

  const emailFormat = {
    from: `Ecom Den<${process.env.SMTP_USER}>`,
    to: email,
    subject: "Email Verification For Your Account",
    html: `
    <table style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; border-collapse: collapse;">
        <tr>
            <td style="text-align: center;">
                <h1>Account Verification</h1>
            </td>
        </tr>
        <tr>
            <td>
                <p>Dear ${firstName + ' ' + lastName},</p>
                <p>Thank you for signing up with us. To complete your registration, please click the link below to verify your email address:</p>
                <p><a href="${verificationUrl}" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none;">Verify Email</a></p>
                <p>If you did not sign up for an account, please ignore this email.</p>
                <p>Thank you,<br> ECO DEN</p>
            </td>
        </tr>
    </table>
    `
  }
  sendEmail(emailFormat)
}

export const sendAccountVerifiedEmail = (user, loginUrl) => {
  const { email, firstName, lastName } = user

  const emailFormat = {
    from: `Eco Den<${process.env.SMTP_USER}>`,
    to: email,
    subject: "Account Verified",
    html: `
    <table style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; border-collapse: collapse;">
        <tr>
            <td style="text-align: center;">
                <h1>Account Verified</h1>
            </td>
        </tr>
        <tr>
            <td>
                <p>Dear ${firstName + ' ' + lastName},</p>
                <p>Your account has been successfully verified. You can now login to our application using the button below:</p>
                <p><a href="${loginUrl}" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none;">Login Now</a></p>
                <p>If you did not verify your account, please ignore this email.</p>
                <p>Thank you,<br> ECO DEN</p>
            </td>
        </tr>
    </table>
    `
  }

  sendEmail(emailFormat)
}

