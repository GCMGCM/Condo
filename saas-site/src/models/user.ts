import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true, index: true },
  fullName: { type: String, required: true },
  passwordHash: { type: String, required: true },
  mobileCountry: { type: String, default: '' },
  mobileNumber: { type: String, default: '' },
  isAdmin: { type: Boolean, default: false },
  isSupportTeam: { type: Boolean, default: false },
  gdprConsent: { type: Boolean, default: false },
  consentGivenAt: { type: Date },
  createdAt: { type: Date, default: () => new Date() },
  updatedAt: { type: Date, default: () => new Date() },
});

UserSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export default models.User || model('User', UserSchema);
