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

  const user = {
    name: req.body.name,
    email: req.body.email,
    roles: ['client'],
  };

  if (req.body.isAdmin) {
    user.roles.push('admin');
  }

  const result = await saveUser(user, true);

  res.json({ result });
});

export default router;
