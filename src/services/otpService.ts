// import nodemailer from "nodemailer";

import * as sgMail from "@sendgrid/mail";

export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOTPEmail(email: string, otp: string) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

  const msg = {
    to: email,
    from: process.env.SENDGRID_SENDER_EMAIL!,
    subject: "Verify Your Email Address",
    text: `Please use the following verification code to verify your email: ${otp}`,
    html: `<p>Use the following code to verify your email:</p><h2>${otp}</h2>`,
  };

  try {
    await sgMail.send(msg);
    console.log("OTP email sent successfully");
  } catch (error) {
    console.error("Error sending OTP email:", error);

    throw new Error("Failed to send OTP email");
  }
}

// export async function sendOTPEmail(email: string, otp: string) {
//   const transporter = nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: Number(process.env.SMTP_PORT),
//     secure: false,
//     auth: {
//       user: process.env.SMTP_USER,
//       pass: process.env.SMTP_PASS,
//     },
//   });

//   const mailOptions = {
//     from: process.env.SMTP_USER,
//     to: email,
//     subject: "Verify Your Email Address",
//     text: `Please use the following verification code to verify your email: ${otp}`,
//     html: `<p>Use the following code to verify your email:</p><h2>${otp}</h2>`,
//   };

//   await transporter.sendMail(mailOptions);
// }
