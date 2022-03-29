import express from 'express';

import { saveUser } from '../../services/user.js';

const router = express.Router();

router.post('/register', async (req, res) => {

  const result = await saveUser({
    name: req.body.name,
    email: req.body.email,
  });

  res.json({ result });
});

export default router;
