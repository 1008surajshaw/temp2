import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { IAuthService } from '../interfaces/IAuthService';
import { IUserRepository } from '../interfaces/IUserRepository';
import { VerificationService } from './VerificationService';
import { LoginDto, LoginResponseDto } from '../dto/auth.dto';
import { VerifyEmailDto, ResendVerificationDto } from '../dto/user.dto';

export class AuthService implements IAuthService {
  private verificationService = new VerificationService();
  
  constructor(private userRepository: IUserRepository) {}

  async login(credentials: LoginDto): Promise<LoginResponseDto> {
    const user = await this.userRepository.findByEmail(credentials.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (!user.is_active) {
      throw new Error('Account is deactivated');
    }

    if (!user.is_verified) {
      await this.verificationService.resendVerificationEmail(user.email);
      throw new Error('Please verify your email. A new verification link has been sent.');
    }

    const isValidPassword = await bcrypt.compare(credentials.password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    const token = this.generateToken(user);

    return {
      user: {
        id: (user._id as mongoose.Types.ObjectId).toString(),
        organization_id: (user.organization_id as mongoose.Types.ObjectId).toString(),
        name: user.name,
        email: user.email,
        user_type: user.user_type,
        is_active: user.is_active,
      },
      token,
      message: 'Login successful'
    };
  }

  async validatePassword(email: string, password: string): Promise<boolean> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return false;
    }

    return await bcrypt.compare(password, user.password);
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  private generateToken(user: any): string {
    const payload = {
      id: (user._id as mongoose.Types.ObjectId).toString(),
      email: user.email,
      organization_id: (user.organization_id as mongoose.Types.ObjectId).toString(),
      user_type: user.user_type
    };

    const secret = process.env.JWT_SECRET || 'your-secret-key';
    return jwt.sign(payload, secret, { expiresIn: '24h' });
  }

  async verifyEmail(token: string): Promise<boolean> {
    return await this.verificationService.verifyEmail(token);
  }

  async resendVerificationEmail(email: string): Promise<boolean> {
    return await this.verificationService.resendVerificationEmail(email);
  }
}