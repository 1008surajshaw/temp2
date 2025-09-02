import { IUser } from '../models/User';

export interface IUserRepository {
  findAll(offset: number, limit: number): Promise<{ users: IUser[]; total: number }>;
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  create(userData: Partial<IUser>): Promise<IUser>;
  update(id: string, userData: Partial<IUser>): Promise<IUser | null>;
  delete(id: string): Promise<boolean>;
}