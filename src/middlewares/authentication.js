import jwt from 'jsonwebtoken';

import db from '../configurations/database.js';

const isAuthenticated = async (req, res, next) => {
  const authorization = req.get('authorization');

  await db.read();

  if (!authorization) {
    return res.sendStatus(401);
  }

  const accessToken = authorization.split(' ')[1];

  const token = db.data.tokens.find(
    (value) => value.type === 'access' && value.token === accessToken
  );

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const decodedAccessToken = jwt.verify(accessToken, process.env.JWT_ENCRYPT_SECRET);

    const client = db.data.clients.find(
      (value) => value.id === decodedAccessToken.id && value.active === true
    );

    if (!client) {
      return res.sendStatus(401);
    }
  } catch (error) {
    return res.sendStatus(401);
  }

  return next();
};

export default isAuthenticated;
