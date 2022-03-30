import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
  userId: mongoose.ObjectId,
  type: String,
  token: String,
  expiresIn: Number,
  createdAt: { type: Date, default: Date.now },
});

export const TokenModel = mongoose.model('Token', tokenSchema);

export default tokenSchema;
