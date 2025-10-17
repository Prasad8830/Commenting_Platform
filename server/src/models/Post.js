import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model('Post', PostSchema);
