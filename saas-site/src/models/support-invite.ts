import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

const SupportInviteSchema = new Schema({
  email: { type: String, required: true, unique: true, index: true },
  fullName: { type: String, required: true },
  invitedBy: { type: String, required: true }, // admin email who invited
  createdAt: { type: Date, default: () => new Date() },
  used: { type: Boolean, default: false },
});

export default models.SupportInvite || model('SupportInvite', SupportInviteSchema);
