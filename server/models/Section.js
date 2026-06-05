import mongoose from 'mongoose';

const SectionSchema = new mongoose.Schema({
  level: {
    type: Number,
    default: 2,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  summary: {
    type: String,
    required: true,
    trim: true,
  },
  keywords: [{
    type: String,
    trim: true,
  }],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Text index for $text search in Pass 1 (coarse retrieval)
SectionSchema.index({ keywords: 'text', summary: 'text' });

export const Section = mongoose.models.Section || mongoose.model('Section', SectionSchema);
export default Section;
