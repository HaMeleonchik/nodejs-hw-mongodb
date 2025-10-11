import nodemailer from 'nodemailer';
import { getEnvVariable } from './getEnvVariable.js';

const transport = nodemailer.createTransport({
  host: getEnvVariable('SMTP_HOST'),
  port: getEnvVariable('SMTP_PORT'),
  secure: false,
  auth: {
    user: getEnvVariable('SMTP_USER'),
    pass: getEnvVariable('SMTP_PASSWORD'),
  },
});

export async function sendMail(mail) {
  mail.from = getEnvVariable('SMTP_FROM');
  await transport.sendMail(mail);
}
