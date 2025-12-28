import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

const CondoManagerInviteSchema = new Schema({
  condoId: { type: Schema.Types.ObjectId, ref: 'Condo', required: true, index: true },
  email: { type: String, required: true },
  invitedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  used: { type: Boolean, default: false },
  createdAt: { type: Date, default: () => new Date() },
});

// Ensure unique combination of condoId + email for pending invites
CondoManagerInviteSchema.index({ condoId: 1, email: 1 }, { unique: true });

export default models.CondoManagerInvite || model('CondoManagerInvite', CondoManagerInviteSchema);
