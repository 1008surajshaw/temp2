import mongoose, { Document, Schema } from 'mongoose';

export interface IPlanFeature extends Document {
  id: string;
  plan_id: mongoose.Types.ObjectId;
  feature_id: mongoose.Types.ObjectId;
  feature_limit: number;
  is_unlimited: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const planFeatureSchema = new Schema<IPlanFeature>({
  plan_id: {
    type: Schema.Types.ObjectId,
    ref: 'Plan',
    required: true,
  },
  feature_id: {
    type: Schema.Types.ObjectId,
    ref: 'Feature',
    required: true,
  },
  feature_limit: {
    type: Number,
    required: true,
    default: 0,
  },
  is_unlimited: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

planFeatureSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

planFeatureSchema.index({ plan_id: 1, feature_id: 1 }, { unique: true });

export const PlanFeature = mongoose.model<IPlanFeature>('PlanFeature', planFeatureSchema);