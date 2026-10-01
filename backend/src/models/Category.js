import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

CategorySchema.index({ name: 1, createdBy: 1 }, { unique: true }); // Unique per user

export default mongoose.model('Category', CategorySchema);
