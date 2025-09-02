import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
import { VerificationToken } from '../models/VerificationToken';
import { User } from '../models/User';
import { EmailService } from './EmailService';

export class VerificationService {
  private emailService = new EmailService();

  async createVerificationToken(userId: string): Promise<string> {
    const token = uuidv4();
    
    await VerificationToken.create({
      identifier: userId,
      token,
      type: 'EMAIL_VERIFICATION',
    });

    return token;
  }

  async sendVerificationEmail(email: string, userId: string): Promise<void> {
    const token = await this.createVerificationToken(userId);
    const verificationLink = `${process.env.BASE_URL || 'http://localhost:3000'}/api/auth/verify-email/${token}`;
    
    await this.emailService.sendVerificationEmail(email, verificationLink);
  }

  async verifyEmail(token: string): Promise<boolean> {
    const verificationToken = await VerificationToken.findOne({
      token,
      type: 'EMAIL_VERIFICATION'
    });

    if (!verificationToken) {
      return false;
    }

    // Check if token is expired (5 minutes)
    const tokenAge = Date.now() - new Date(verificationToken.createdAt).getTime();
    const isExpired = tokenAge > 5 * 60 * 1000; // 5 minutes

    if (isExpired) {
      await VerificationToken.findByIdAndDelete(verificationToken._id);
      return false;
    }

    // Update user verification status
    await User.findByIdAndUpdate(verificationToken.identifier, { is_verified: true });

    // Delete verification token
    await VerificationToken.findByIdAndDelete(verificationToken._id);

    return true;
  }

  async resendVerificationEmail(email: string): Promise<boolean> {
    const user = await User.findOne({ email });
    if (!user || user.is_verified) {
      return false;
    }

    // Delete existing tokens
    await VerificationToken.deleteMany({
      identifier: (user._id as mongoose.Types.ObjectId).toString(),
      type: 'EMAIL_VERIFICATION'
    });

    // Send new verification email
    await this.sendVerificationEmail(email, (user._id as mongoose.Types.ObjectId).toString());
    return true;
  }
}