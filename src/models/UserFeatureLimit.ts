import mongoose, { Document, Schema } from 'mongoose';

export interface IUserFeatureLimit extends Document {
  id: string;
  user_id: mongoose.Types.ObjectId;
  feature_id: mongoose.Types.ObjectId;
  total_limit: number;
  is_unlimited: boolean;
  current_usage: number;
  last_calculated: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const userFeatureLimitSchema = new Schema<IUserFeatureLimit>({
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
  total_limit: {
    type: Number,
    required: true,
    default: 0,
  },
  is_unlimited: {
    type: Boolean,
    default: false,
  },
  current_usage: {
    type: Number,
    default: 0,
  },
  last_calculated: {
    type: Schema.Types.ObjectId,
    ref: 'Usage',
    required: true,
  },
}, {
  timestamps: true,
});



userFeatureLimitSchema.index({ user_id: 1, feature_id: 1 }, { unique: true });

export const UserFeatureLimit = mongoose.model<IUserFeatureLimit>('UserFeatureLimit', userFeatureLimitSchema);