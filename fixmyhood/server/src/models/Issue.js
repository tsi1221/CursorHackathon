import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema(
  {
    deviceId: { type: String, required: true },
    name: { type: String, default: 'Resident' },
    text: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const IssueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    city: { type: String, default: 'Addis Ababa' },
    subCity: { type: String, default: '' },
    woreda: { type: String, default: '' },
    address: { type: String, default: '' },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: true, // [lng, lat]
        validate: {
          validator: (val) => Array.isArray(val) && val.length === 2,
          message: 'coordinates must be [lng, lat]'
        }
      },
    },
    imageUrl: { type: String, default: '' },
    imagePublicId: { type: String, default: '' },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved'],
      default: 'open',
    },
    upvotes: { type: Number, default: 0 },
    upvoters: { type: [String], default: [] },
    comments: { type: [CommentSchema], default: [] },
  },
  { timestamps: true }
);

IssueSchema.index({ location: '2dsphere' });
IssueSchema.index({ status: 1, createdAt: -1 });

export const Issue = mongoose.model('Issue', IssueSchema);