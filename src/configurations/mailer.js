import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

import winstonLogger from './logger.js';

dotenv.config();

let testAccount = null;
if (process.env.MAIL_DEBUG === 'true') {
  winstonLogger.debug('Mailer is in debug mode');
  testAccount = await nodemailer.createTestAccount();
}

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || "smtp.ethereal.email",
  port: process.env.MAIL_PORT || 587,
  secure: (process.env.MAIL_SECURE === 'true'), // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USER || testAccount?.user, // generated ethereal user
    pass: process.env.MAIL_PASS || testAccount?.pass // generated ethereal password
  },
});

export default transporter;
