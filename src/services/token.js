import jwt from 'jsonwebtoken';

import { TokenModel } from '../schemas/token.js';

export const decodeToken = (token) => jwt.verify(token, process.env.JWT_ENCRYPT_SECRET);

export const getAndDecodeToken = (request) => {
  const authorization = request.get('authorization');
  const token = authorization.split(' ')[1];
  return decodeToken(token);
};

export const generateToken = (userId, type) => {
  let expiration = process.env.JWT_EXPIRATION_ACCESS_TOKEN || '2h';
  if (type === 'refresh') {
    expiration = process.env.JWT_EXPIRATION_REFRESH_TOKEN || '1d';
  }

  const token = jwt.sign(
    { id: userId, type },
    process.env.JWT_ENCRYPT_SECRET,
    {
      algorithm: process.env.JWT_ENCRYPT_ALGLORITHM || 'HS256',
      expiresIn: expiration,
    }
  );

  const decodedToken = jwt.verify(token, process.env.JWT_ENCRYPT_SECRET);

  return { token, exp: decodedToken.exp };
};

export const saveToken = async (userId, type, token) => {
  const decodedToken = jwt.verify(token, process.env.JWT_ENCRYPT_SECRET);

  return TokenModel.create({
    userId,
    type,
    token,
    expiresIn: decodedToken.exp,
  });
};

export const saveTokens = async (userId, tokens) => {
  tokens.forEach(async (token) => {
    await saveToken(userId, token.type, token.value);
  });
};

export const findTokenByTypeAndValue = async (type, value) => {
  const token = TokenModel.findOne({
    type,
    token: value,
  });

  return token;
};

export const deleteAllByUserId = async (userId) => TokenModel.deleteMany({ userId });

export default {
  decodeToken,
  generateToken,
  saveToken,
  saveTokens,
  findTokenByTypeAndValue,
  deleteAllByUserId,
};
