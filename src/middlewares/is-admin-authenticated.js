import jwt from 'jsonwebtoken';

import { findUserActiveById } from '../services/user.js';
import { findTokenByTypeAndValue } from '../services/token.js';
import winstonLogger from '../configurations/logger.js';

const isAdminAuthenticated = async (req, res, next) => {
  const authorization = req.get('authorization');

  if (!authorization) {
    return res.sendStatus(401);
  }

  const accessToken = authorization.split(' ')[1];

  const token = await findTokenByTypeAndValue('access', accessToken);

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const decodedToken = jwt.verify(accessToken, process.env.JWT_ENCRYPT_SECRET);

    const user = await findUserActiveById(decodedToken.id);

    if (user == null) {
      return res.sendStatus(401);
    }

    if (!user.roles.includes('admin')) {
      return res.sendStatus(403);
    }
  } catch (error) {
    winstonLogger.error(error);
    return res.sendStatus(401);
  }

  return next();
};

export default isAdminAuthenticated;
