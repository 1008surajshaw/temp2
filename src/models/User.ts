import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  id: string;
  organization_id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  user_type: 'admin' | 'user';
  is_active: boolean;
  is_verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  organization_id: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  user_type: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  is_verified: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export const User = mongoose.model<IUser>('User', userSchema);