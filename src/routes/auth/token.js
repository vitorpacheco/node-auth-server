import express from 'express';

import { findUserByClientIdAndSecret } from '../../services/user.js';
import { saveTokens, generateToken } from '../../services/token.js';

const router = express.Router();

router.post('/token', async (req, res) => {
  const request = req.body;

  const user = await findUserByClientIdAndSecret(request.client_id, request.client_secret);

  if (user == null || !user.active) {
    res.sendStatus(400);
    return;
  }

  const accessToken = generateToken(user.id, 'access');
  const refreshToken = generateToken(user.id, 'refresh');

  await saveTokens(user.id, [
    { type: 'access', value: accessToken.token },
    { type: 'refresh', value: refreshToken.token },
  ]);

  res.json({
    accessToken: accessToken.token,
    refreshToken: refreshToken.token,
    tokenType: 'Bearer',
    expiresIn: accessToken.exp,
  });
});

export default router;
