import mongoose from 'mongoose';
import { IUserService } from '../interfaces/IUserService';
import { IUserRepository } from '../interfaces/IUserRepository';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from '../dto/user.dto';
import { PaginatedResponse } from '../types/common';
import { VerificationService } from './VerificationService';
import bcrypt from 'bcrypt';

export class UserService implements IUserService {
  private verificationService = new VerificationService();
  
  constructor(private userRepository: IUserRepository) {}

  async getAllUsers(page: number, limit: number): Promise<PaginatedResponse<UserResponseDto>> {
    const offset = (page - 1) * limit;
    const { users, total } = await this.userRepository.findAll(offset, limit);
    
    return {
      success: true,
      data: users.map(this.mapToResponseDto),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUserById(id: string): Promise<UserResponseDto | null> {
    const user = await this.userRepository.findById(id);
    return user ? this.mapToResponseDto(user) : null;
  }

  async createUser(userData: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password before storing
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    const user = await this.userRepository.create({
      ...userData,
      organization_id: new mongoose.Types.ObjectId(userData.organization_id),
      password: hashedPassword,
      is_verified: false
    });

    // Send verification email
    await this.verificationService.sendVerificationEmail(userData.email, user._id.toString());
    
    return this.mapToResponseDto(user);
  }

  async updateUser(id: string, userData: UpdateUserDto): Promise<UserResponseDto | null> {
    if (userData.email) {
      const existingUser = await this.userRepository.findByEmail(userData.email);
      if (existingUser && (existingUser._id as mongoose.Types.ObjectId).toString() !== id) {
        throw new Error('Email already in use');
      }
    }

    const user = await this.userRepository.update(id, userData);
    return user ? this.mapToResponseDto(user) : null;
  }

  async deleteUser(id: string): Promise<boolean> {
    return await this.userRepository.delete(id);
  }

  async getUserByEmail(email: string): Promise<UserResponseDto | null> {
    const user = await this.userRepository.findByEmail(email);
    return user ? this.mapToResponseDto(user) : null;
  }

  private mapToResponseDto(user: any): UserResponseDto {
    return {
      id: (user._id as mongoose.Types.ObjectId).toString(),
      organization_id: (user.organization_id as mongoose.Types.ObjectId).toString(),
      name: user.name,
      email: user.email,
      user_type: user.user_type,
      is_active: user.is_active,
      is_verified: user.is_verified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}