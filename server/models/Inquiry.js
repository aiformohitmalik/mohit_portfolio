import mongoose from 'mongoose';

const InquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name must be 100 characters or fewer'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    maxlength: [254, 'Email must be 254 characters or fewer'],
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
  },
  organization: {
    type: String,
    trim: true,
    default: '',
    maxlength: [150, 'Organization must be 150 characters or fewer'],
  },
  purpose: {
    type: String,
    required: [true, 'Purpose is required'],
    enum: ['Recruitment', 'Collaboration', 'Consultation', 'General Inquiry'],
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [2000, 'Message must be 2000 characters or fewer'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);
export default Inquiry;
