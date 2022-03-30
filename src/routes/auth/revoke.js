import express from 'express';

import { findUserByClientId } from '../../services/user.js';
import { deleteAllByUserId } from '../../services/token.js';
import isAdminAuthenticated from '../../middlewares/is-admin-authenticated.js';

const router = express.Router();

router.post('/revoke', isAdminAuthenticated, async (req, res) => {
  const user = await findUserByClientId(req.body.client_id);

  await deleteAllByUserId(user.id);

  if (!user) {
    res.sendStatus(404);
  }

  res.sendStatus(204);
});

export default router;
