import express from 'express';

import { saveUser, existsByEmail } from '../../services/user.js';
import isAdminAuthenticated from '../../middlewares/is-admin-authenticated.js';

const router = express.Router();

router.post('/register', isAdminAuthenticated, async (req, res) => {
  const exists = await existsByEmail(req.body.email);

  if (exists) {
    res.sendStatus(400);
    return;
  }

  const result = await saveUser({
    name: req.body.name,
    email: req.body.email,
  });

  res.json({ result });
});

export default router;
