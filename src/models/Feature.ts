import mongoose, { Document, Schema } from 'mongoose';

export interface IFeature extends Document {
  id: string;
  organization_id: mongoose.Types.ObjectId;
  name: string;
  feature_key: string;
  description?: string;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const featureSchema = new Schema<IFeature>({
  organization_id: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  feature_key: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  is_active: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

featureSchema.index({ organization_id: 1, feature_key: 1 }, { unique: true });

export const Feature = mongoose.model<IFeature>('Feature', featureSchema);