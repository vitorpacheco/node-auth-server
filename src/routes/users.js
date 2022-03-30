import express from 'express';

const router = express.Router();

/**
 * @swagger
 *
 * /:
 *  get:
 *    description: Get users
 *    responses:
 *      200:
 *        description: OK
 */
router.get('/', (req, res) => {
  res.json({ result: 'respond with a resource' });
});

export default router;
