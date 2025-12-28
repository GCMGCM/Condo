import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

const CondoTypeSchema = new Schema({
  name: { type: String, required: true, unique: true },
  isDefault: { type: Boolean, default: false },
  createdAt: { type: Date, default: () => new Date() },
  updatedAt: { type: Date, default: () => new Date() },
});

export default models.CondoType || model('CondoType', CondoTypeSchema);
