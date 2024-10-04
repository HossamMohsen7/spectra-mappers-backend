import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport/index.js";
import env from "../env.js";

let transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

const createTransport = async () => {
  return await createGmailTransport();
};

const createGmailTransport = async () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    from: `"Spectra Mappers" <hosam.mohsen13@gmail.com>`,
    debug: true,
    auth: {
      user: "hosam.mohsen13@gmail.com",
      pass: env.EMAIL_PASSWORD,
    },
  });
};

const sendVerificationEmail = async (email: string, code: string) => {
  if (!transporter) {
    transporter = await createTransport();
  }

  await transporter.sendMail({
    to: email,

    html: `<h1>Verify your email</h1>
<p>Enter the code below to verify your email</p>
<p>${code}</p>`,
  });
};

export const mailService = {
  sendVerificationEmail,
};
