import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

const UserLogSchema = new Schema({
  email: { type: String, required: true },
  fullName: { type: String, required: true },
  action: { type: String, required: true, enum: ['signup', 'signin', 'signout'] },
  ipAddress: { type: String, required: true },
  timestamp: { type: Date, default: () => new Date() },
});

export default models.UserLog || model('UserLog', UserLogSchema);
