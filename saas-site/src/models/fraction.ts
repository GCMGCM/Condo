import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

const FractionSchema = new Schema({
  condoId: { type: Schema.Types.ObjectId, ref: 'Condo', required: true, index: true },
  identifier: { type: String, required: true }, // e.g., "Apt 101", "Unit 5B"
  ownerFullName: { type: String, required: true },
  ownerEmail: { type: String, required: true },
  ownerCountryMobile: { type: String, default: '' }, // e.g., "+351"
  ownerMobile: { type: String, default: '' },
  ownershipShare: { type: Number, default: 0 }, // Percentage: 0-100
  addressLine1: { type: String, default: '' },
  addressLine2: { type: String, default: '' },
  postalCode: { type: String, default: '' },
  country: { type: String, default: '' },
  ownerInvited: { type: Boolean, default: false },
  ownerAccepted: { type: Boolean, default: false },
  ownerUserId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  createdAt: { type: Date, default: () => new Date() },
  updatedAt: { type: Date, default: () => new Date() },
});

// Ensure unique identifier per condo
FractionSchema.index({ condoId: 1, identifier: 1 }, { unique: true });

export default models.Fraction || model('Fraction', FractionSchema);
