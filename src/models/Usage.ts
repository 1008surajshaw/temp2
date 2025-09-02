import mongoose, { Document, Schema } from 'mongoose';

export interface IUsage extends Document {
  id: string;
  user_id: mongoose.Types.ObjectId;
  feature_id: mongoose.Types.ObjectId;
  usage_count: number;
  usage_date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const usageSchema = new Schema<IUsage>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  feature_id: {
    type: Schema.Types.ObjectId,
    ref: 'Feature',
    required: true,
  },
  usage_count: {
    type: Number,
    required: true,
    default: 0,
  },
  usage_date: {
    type: Date,
    required: true,
    default: Date.now,
  },
}, {
  timestamps: true,
});

export const Usage = mongoose.model<IUsage>('Usage', usageSchema);