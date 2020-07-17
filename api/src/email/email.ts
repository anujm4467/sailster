import nodemailer = require('nodemailer');
import smtpTransport = require('nodemailer/lib/smtp-transport');
import mailer = require('nodemailer/lib/mailer');

const connectionInfo: smtpTransport.Options = {
  host: process.env.EMAIL_HOST,
  port: JSON.parse(process.env.EMAIL_PORT || '465'),
  secure: JSON.parse(process.env.EMAIL_SECURE || 'true'),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(connectionInfo);

export const sendEmail = (email: mailer.Options): Promise<nodemailer.SentMessageInfo> => {
  return transporter.sendMail(email);
};
