import express from "express";
import jwt from "jsonwebtoken";

import db from "../../configurations/database.js";
import isAuthenticated from "../../middlewares/authentication.js";

const router = express.Router();

router.get("/userinfo", isAuthenticated, async (req, res) => {
  const authorization = req.get("authorization");
  const accessToken = authorization.split(" ")[1];
  const decodedAccessToken = jwt.verify(accessToken, "asdf");

  await db.read();

  const client = db.data.clients.find(
    (value) => value.id === decodedAccessToken.id && value.active
  );

  if (!client) {
    res.sendStatus(404);
  }

  res.json(client);
});

export default router;
