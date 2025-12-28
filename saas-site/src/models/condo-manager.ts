import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

const CondoManagerSchema = new Schema({
  condoId: { type: Schema.Types.ObjectId, ref: 'Condo', required: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  invitedBy: { type: Schema.Types.ObjectId, ref: 'User' }, // Who invited this manager
  createdAt: { type: Date, default: () => new Date() },
});

// Ensure unique combination of condoId + userId
CondoManagerSchema.index({ condoId: 1, userId: 1 }, { unique: true });

export default models.CondoManager || model('CondoManager', CondoManagerSchema);
