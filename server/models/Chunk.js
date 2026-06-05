import mongoose from 'mongoose';

const ChunkSchema = new mongoose.Schema({
  level: {
    type: Number,
    default: 3,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section',
    required: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  text: {
    type: String,
    required: true,
    trim: true,
  },
  keywords: [{
    type: String,
    trim: true,
  }],
});

// Text index for $text search in Pass 2 (fine retrieval)
ChunkSchema.index({ text: 'text', keywords: 'text' });
// Compound index for parentId lookups
ChunkSchema.index({ parentId: 1 });

export const Chunk = mongoose.models.Chunk || mongoose.model('Chunk', ChunkSchema);
export default Chunk;
