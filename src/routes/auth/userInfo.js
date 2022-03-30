import express from 'express';

import { findUserActiveById } from '../../services/user.js';
import { getAndDecodeToken } from '../../services/token.js';
import isAuthenticated from '../../middlewares/is-authenticated.js';

const router = express.Router();

router.get('/userinfo', isAuthenticated, async (req, res) => {
  const decodedToken = getAndDecodeToken(req);

  const user = await findUserActiveById(decodedToken.id);

  if (!user) {
    res.sendStatus(404);
  }

  res.json(user);
});

export default router;
