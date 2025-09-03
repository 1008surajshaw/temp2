import mongoose, { Document, Schema } from 'mongoose';

export interface IUsage extends Document {
  id: string;
  userFeatureLimit_id: mongoose.Types.ObjectId;
  usage_count: number;
  createdAt: Date;
  updatedAt: Date;
}

const usageSchema = new Schema<IUsage>({
  userFeatureLimit_id:{
    type: Schema.Types.ObjectId,
    ref: 'UserFeatureLimit',
    required: true,
  },
  usage_count: {
    type: Number,
    required: true,
    default: 0,
  }
  
}, {
  timestamps: true,
});

export const Usage = mongoose.model<IUsage>('Usage', usageSchema);