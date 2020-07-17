import nodemailer = require('nodemailer');
import SMTPTransport = require('nodemailer/lib/smtp-transport');
import Mail = require('nodemailer/lib/mailer');

const connectionInfo: SMTPTransport.Options = {
  host: process.env.EMAIL_HOST,
  port: JSON.parse(process.env.EMAIL_PORT || "465"),
  secure: JSON.parse(process.env.EMAIL_SECURE || "true"),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(connectionInfo);

export const sendEmail = (email: Mail.Options): Promise<nodemailer.SentMessageInfo> => {
  return transporter.sendMail(email);
};
