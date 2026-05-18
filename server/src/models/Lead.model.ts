import mongoose, { Schema } from 'mongoose';
import { ILeadDocument } from '../types/lead.types';

const leadSchema = new Schema<ILeadDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [150, 'Name must not exceed 150 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    status: {
      type: String,
      enum: {
        values: ['new', 'contacted', 'qualified', 'lost'],
        message: 'Status must be one of: new, contacted, qualified, lost',
      },
      default: 'new',
    },
    source: {
      type: String,
      enum: {
        values: ['website', 'instagram', 'referral'],
        message: 'Source must be one of: website, instagram, referral',
      },
      required: [true, 'Source is required'],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Indexes for efficient querying
leadSchema.index({ createdBy: 1, createdAt: -1 });
leadSchema.index({ status: 1 });
leadSchema.index({ source: 1 });
leadSchema.index({ name: 'text', email: 'text' }); // Full-text search

export const Lead = mongoose.model<ILeadDocument>('Lead', leadSchema);
