import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

import winstonLogger from '../configurations/logger.js';
import { UserModel } from '../schemas/user.js';
import { generateEmailForNewUser, sendMail } from './mail.js';

export const findAdminUsers = async () => {
  const usersAdmin = await UserModel.count({
    roles: { $eq: 'admin' },
  }).exec();

  return usersAdmin;
};

export const createAdminUser = async () => {
  winstonLogger.info(`creating a new admin user with email: ${process.env.ADMIN_EMAIL}`);

  const name = process.env.ADMIN_EMAIL.substring(
    0,
    process.env.ADMIN_EMAIL.lastIndexOf('@')
  );
  const secret = uuidv4();

  await UserModel.create({
    name,
    email: process.env.ADMIN_EMAIL,
    clientId: name,
    clientSecret: await bcrypt.hash(secret, 10),
    roles: ['admin'],
  });

  winstonLogger.info(
    `admin user created with clientId: ${name}, clientSecret: ${secret}`
  );

  const { plainBody, htmlBody } = generateEmailForNewUser(name, secret);

  await sendMail(
    'auth-server@example.com',
    process.env.ADMIN_EMAIL,
    'Welcome to Auth Server',
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

export const findUserByClientIdAndSecret = async (clientId, clientSecret) =>
  new Promise((resolve, reject) => {
    const user = UserModel.findOne({
      clientId,
    }).exec();

    user.then(async (userStored) => {
      const isMatch = await bcrypt.compare(clientSecret, userStored.clientSecret);

      if (isMatch) {
        return resolve(userStored);
      }

      return reject(new Error('Invalid clientId or clientSecret'));
    });
  });

export const saveUser = async (user, sendEmail = false) => {
  const secret = uuidv4();

  const result = UserModel.create({
    name: user.name,
    email: user.email,
    clientId: user.name,
    clientSecret: await bcrypt.hash(secret, 10),
    roles: user.roles,
  });

  if (sendEmail) {
    const { plainBody, htmlBody } = generateEmailForNewUser(user.name, secret);

    await sendMail(
      'auth-server@example.com',
      process.env.ADMIN_EMAIL,
      'Welcome to Auth Server',
      plainBody,
      htmlBody
    );
  }

  return result;
};

export const findUserActiveById = async (id) => {
  const user = UserModel.findOne({
    id: mongoose.Types.ObjectId(id), active: true,
  }).exec();

  return user;
};

export const findUserByClientId = async (clientId) => {
  const user = UserModel.findOne({
    clientId,
  }).exec();

  return user;
};

export const existsByEmail = async (email) => {
  const user = await UserModel.findOne({
    email
  }).exec();

  return user !== null;
};

export default {
  findAdminUsers,
  createAdminUser,
  checkAdminUser,
  findUserByClientIdAndSecret,
  saveUser,
  findUserActiveById,
  findUserByClientId,
  existsByEmail,
};
