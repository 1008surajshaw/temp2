import mongoose, { Document, Schema } from 'mongoose';

export interface IOrganization extends Document {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const organizationSchema = new Schema<IOrganization>({
  name: {
    type: String,
    required: true,
    unique: true,
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

export const Organization = mongoose.model<IOrganization>('Organization', organizationSchema);