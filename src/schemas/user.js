import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  clientId: String,
  clientSecret: String,
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  roles: [{ type: String }]
});

export const UserModel = mongoose.model('User', userSchema);

export default userSchema;
