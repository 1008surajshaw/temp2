import mongoose, { Document, Schema } from 'mongoose';

export interface IVerificationToken extends Document {
  id: string;
  token: string;
  identifier: string;
  type: 'EMAIL_VERIFICATION';
  createdAt: Date;
  updatedAt: Date;
}

const verificationTokenSchema = new Schema<IVerificationToken>({
  token: {
    type: String,
    required: true,
  },
  identifier: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['EMAIL_VERIFICATION'],
    required: true,
  },
}, {
  timestamps: true,
});

verificationTokenSchema.index({ token: 1, identifier: 1 }, { unique: true });

export const VerificationToken = mongoose.model<IVerificationToken>('VerificationToken', verificationTokenSchema);