import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

import db from '../../configurations/database.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const client = uuidv4();

  const result = db.data.clients.push({
    id: uuidv4(),
    name: req.body.name,
    clientId: client,
    clientSecret: await bcrypt.hash(client, 10),
    active: true,
    createdAt: new Date().getTime(),
  });

  await db.write();

  res.json({ result });
});

export default router;
