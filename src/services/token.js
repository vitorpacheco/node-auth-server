import jwt from 'jsonwebtoken';

import { TokenModel } from '../schemas/token.js';

export const findTokenByClientIdAndSecret = async (clientId, clientSecret) => {
};

export const saveToken = async (clientId, type, token) => {
  const decodedToken = jwt.verify(token, process.env.JWT_ENCRYPT_SECRET);

  return TokenModel.create({
    clientId,
    type,
    token,
    expiresIn: decodedToken.exp,
  });
};
