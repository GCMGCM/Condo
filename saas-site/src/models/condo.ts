import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

const CondoSchema = new Schema({
  name: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  addressLine1: { type: String, default: '' },
  addressLine2: { type: String, default: '' },
  postalCode: { type: String, default: '' },
  country: { type: String, default: '' },
  condoEmail: { type: String, default: '' },
  type: { type: String, required: true }, // References CondoType name
  avatar: { type: String, default: '' },
  lastActivityAt: { type: Date, default: () => new Date() },
  createdAt: { type: Date, default: () => new Date() },
  updatedAt: { type: Date, default: () => new Date() },
});

export default models.Condo || model('Condo', CondoSchema);
