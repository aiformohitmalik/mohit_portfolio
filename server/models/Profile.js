import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
  level: {
    type: Number,
    default: 1,
  },
  category: {
    type: String,
    default: 'profile',
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

export const Profile = mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);
export default Profile;
