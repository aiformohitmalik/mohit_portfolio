import mongoose from 'mongoose';

const InquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
  },
  organization: {
    type: String,
    trim: true,
    default: '',
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
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);
export default Inquiry;
