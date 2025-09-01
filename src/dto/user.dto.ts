export interface CreateUserDto {
  organization_id: number;
  name: string;
  email: string;
  password: string;
  user_type?: 'admin' | 'user';
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
}

export interface UserResponseDto {
  id: number;
  name: string;
  email: string;
  user_type: 'admin' | 'user';
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}