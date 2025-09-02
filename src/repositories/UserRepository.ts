import { IUserRepository } from '../interfaces/IUserRepository';
import { User, IUser } from '../models/User';
import { BaseRepository } from './BaseRepository';

export class UserRepository extends BaseRepository<IUser> implements IUserRepository {
  constructor() {
    super(User);
  }

  async findAll(offset: number, limit: number): Promise<{ users: IUser[]; total: number }> {
    const users = await this.model.find().skip(offset).limit(limit).sort({ createdAt: -1 });
    const total = await this.model.countDocuments();
    return { users, total };
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await this.model.findOne({ email });
  }

  async findById(id: string): Promise<IUser | null> {
    return await this.model.findById(id);
  }

  async create(userData: Partial<IUser>): Promise<IUser> {
    return await this.model.create(userData);
  }

  async update(id: string, userData: Partial<IUser>): Promise<IUser | null> {
    return await this.model.findByIdAndUpdate(id, userData, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return !!result;
  }
}