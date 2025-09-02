import mongoose, { Document, Schema } from 'mongoose';

export interface IUserSubscription extends Document {
  id: string;
  user_id: mongoose.Types.ObjectId;
  plan_id: mongoose.Types.ObjectId;
  start_date: Date;
  end_date: Date;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSubscriptionSchema = new Schema<IUserSubscription>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  plan_id: {
    type: Schema.Types.ObjectId,
    ref: 'Plan',
    required: true,
  },
  start_date: {
    type: Date,
    required: true,
  },
  end_date: {
    type: Date,
    required: true,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

export const UserSubscription = mongoose.model<IUserSubscription>('UserSubscription', userSubscriptionSchema);