import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

import { findTokenByClientIdAndSecret } from '../../services/user.js';
import { saveToken } from '../../services/token.js';
import db from '../../configurations/database.js';

const router = express.Router();

router.post('/token', async (req, res) => {
  const request = req.body;

  const client = await findTokenByClientIdAndSecret(request.client_id, request.client_secret);

  if (client == null || !client.active) {
    res.sendStatus(400);
    return;
  }

  const accessToken = jwt.sign(
    { id: client.id, type: 'access' },
    process.env.JWT_ENCRYPT_SECRET,
    {
      algorithm: process.env.JWT_ENCRYPT_ALGLORITHM || 'HS256',
      expiresIn: process.env.JWT_EXPIRATION_ACCESS_TOKEN || '2h',
    }
  );

  const refreshToken = jwt.sign(
    { id: client.id, type: 'refresh' },
    process.env.JWT_ENCRYPT_SECRET,
    {
      algorithm: process.env.JWT_ENCRYPT_ALGLORITHM || 'HS256',
      expiresIn: process.env.JWT_EXPIRATION_REFRESH_TOKEN || '1d',
    }
  );

  await saveToken(client.id, 'access', accessToken);
  await saveToken(client.id, 'refresh', refreshToken);

  const decodedAccessToken = jwt.verify(accessToken, process.env.JWT_ENCRYPT_SECRET);

  // db.data.tokens.push({
  //   id: uuidv4(),
  //   clientId: client.id,
  //   type: 'access',
  //   token: accessToken,
  //   expiresIn: decodedAccessToken.exp,
  //   createdAt: new Date().getTime(),
  // });

  // const decodedRefreshToken = jwt.verify(refreshToken, process.env.JWT_ENCRYPT_SECRET);

  // db.data.tokens.push({
  //   id: uuidv4(),
  //   clientId: client.id,
  //   type: 'refresh',
  //   token: refreshToken,
  //   expiresIn: decodedRefreshToken.exp,
  //   createdAt: new Date().getTime(),
  // });

  // await db.write();

  res.json({
    accessToken,
    refreshToken,
    tokenType: 'Bearer',
    expiresIn: decodedAccessToken.exp,
  });
});

export default router;
