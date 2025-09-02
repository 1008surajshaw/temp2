import { CreateUserDto, UpdateUserDto, UserResponseDto } from '../dto/user.dto';
import { PaginatedResponse } from '../types/common';

export interface IUserService {
  getAllUsers(page: number, limit: number): Promise<PaginatedResponse<UserResponseDto>>;
  getUserById(id: string): Promise<UserResponseDto | null>;
  createUser(userData: CreateUserDto): Promise<UserResponseDto>;
  updateUser(id: string, userData: UpdateUserDto): Promise<UserResponseDto | null>;
  deleteUser(id: string): Promise<boolean>;
  getUserByEmail(email: string): Promise<UserResponseDto | null>;
}