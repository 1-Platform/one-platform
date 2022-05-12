import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export const setupNodeMailer = (options: SMTPTransport.Options) => {
  return nodemailer.createTransport(options);
};
