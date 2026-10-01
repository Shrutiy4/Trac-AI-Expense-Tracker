import mongoose from 'mongoose';

const GroupSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

GroupSchema.index({ name: 1, createdBy: 1 }, { unique: true }); // Unique per user

export default mongoose.model('Group', GroupSchema);
