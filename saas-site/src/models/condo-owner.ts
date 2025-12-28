import mongoose from 'mongoose';

const CondoOwnerSchema = new mongoose.Schema({
  condoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Condo',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index to prevent duplicate owner-condo relationships
CondoOwnerSchema.index({ condoId: 1, userId: 1 }, { unique: true });

const CondoOwner = mongoose.models.CondoOwner || mongoose.model('CondoOwner', CondoOwnerSchema);

export default CondoOwner;
