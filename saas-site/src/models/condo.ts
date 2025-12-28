import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

const CondoSchema = new Schema({
  name: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  avatar: { type: String, default: '' }, // Will store emoji or initials
  lastActivityAt: { type: Date, default: () => new Date() },
  createdAt: { type: Date, default: () => new Date() },
  updatedAt: { type: Date, default: () => new Date() },
});

export default models.Condo || model('Condo', CondoSchema);
