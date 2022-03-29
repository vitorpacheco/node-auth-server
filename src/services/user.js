import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

import winstonLogger from '../configurations/logger.js';
import { sendMail } from '../configurations/mailer.js';
import { UserModel } from '../schemas/user.js';

const generateEmailForNewAdminUser = (name, secret) => {
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

export const findAdminUsers = async () => {
  const usersAdmin = await UserModel.count({
    roles: {$eq: 'admin'},
  }).exec();

  return usersAdmin;
};

export const createAdminUser = async () => {
  winstonLogger.info(`creating a new admin user with email: ${process.env.ADMIN_EMAIL}`);

  const name = process.env.ADMIN_EMAIL.substring(0, process.env.ADMIN_EMAIL.lastIndexOf("@"));
  const secret = uuidv4();

  await UserModel.create({
    name,
    email: process.env.ADMIN_EMAIL,
    clientId: name,
    clientSecret: await bcrypt.hash(secret, 10),
    roles: ["admin"],
  });

  winstonLogger.info(`admin user created with clientId: ${name}, clientSecret: ${secret}`);

  const { plainBody, htmlBody } = generateEmailForNewAdminUser(name, secret);

  await sendMail(
    "auth-server@example.com",
    process.env.ADMIN_EMAIL,
    "Welcome to Auth Server",
    plainBody,
    htmlBody
  );
};

export const checkAdminUser = async () => {
  const usersAdmin = await findAdminUsers();

  if (usersAdmin > 0) {
    winstonLogger.info(`${usersAdmin} admin user found`);
    return;
  }

  await createAdminUser();
};

export const findTokenByClientIdAndSecret = async (clientId, clientSecret) => new Promise((resolve, reject) => {
  const user = UserModel.findOne({
    clientId,
  }).exec();

  user.then(async (userStored) => {
    const isMatch = await bcrypt.compare(clientSecret, userStored.clientSecret);

    if (isMatch) {
      return resolve(userStored);
    }

    return reject(new Error("Invalid clientId or clientSecret"));
  });
});

export const saveUser = async (user) => {
  const secret = uuidv4();

  return UserModel.create({
    name: user.name,
    email: user.email,
    clientId: user.name,
    clientSecret: await bcrypt.hash(secret, 10),
    roles: ["client"],
  });

  // TODO: send email to user
};

export default {
  findAdminUsers,
  createAdminUser,
  checkAdminUser,
  findTokenByClientIdAndSecret,
  saveUser,
};
