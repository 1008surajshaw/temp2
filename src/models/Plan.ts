import mongoose, { Document, Schema } from 'mongoose';

export interface IPlan extends Document {
  id: string;
  organization_id: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  price: number;
  billing_cycle: 'monthly' | 'yearly';
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const planSchema = new Schema<IPlan>({
  organization_id: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    required: true,
  },
  billing_cycle: {
    type: String,
    enum: ['monthly', 'yearly'],
    required: true,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

export const Plan = mongoose.model<IPlan>('Plan', planSchema);