import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport/index.js";

let transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

const createTransport = async () => {
  return await createGmailTransport();
};

const createGmailTransport = async () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    from: `"Spectra Mappers" <ieee.mansb@gmail.com>`,
    debug: true,
    auth: {
      user: "ieee.mansb@gmail.com",
      pass: "pqny ayef fvhy sibv",
    },
  });
};

const sendVerificationEmail = async (email: string, code: string) => {};

export const mailService = {
  sendVerificationEmail,
};
