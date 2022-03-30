import nodemailer from 'nodemailer';

import transporter from '../configurations/mailer.js';
import winstonLogger from '../configurations/logger.js';

export const generateEmailForNewUser = (name, secret) => {
  const plainBody = `You can use the following credentials to login:\n Client ID: ${name}\nClient Secret: ${secret}`;

  const htmlBody = `
  <h1>Welcome to the auth server</h1>
  <p>
    You can use the following credentials to login:
  </p>

  <ul>
    <li>Client ID: ${name}</li>
    <li>Client Secret: ${secret}</li>
  </ul>
`;
  return { plainBody, htmlBody };
};

export const sendMail = async (from, to, subject, text, html = null) => {
  const info = await transporter.sendMail({ from, to, subject, text, html });

  winstonLogger.info(`Message sent: ${info.messageId}`);
  winstonLogger.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
};
