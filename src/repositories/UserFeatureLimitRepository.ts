import mongoose from 'mongoose';
import { IUserFeatureLimitRepository } from '../interfaces/IUserFeatureLimitRepository';
import { UserFeatureLimit, IUserFeatureLimit } from '../models/UserFeatureLimit';
import { BaseRepository } from './BaseRepository';

export class UserFeatureLimitRepository extends BaseRepository<IUserFeatureLimit> implements IUserFeatureLimitRepository {
  constructor() {
    super(UserFeatureLimit);
  }

  async findByUser(userId: string): Promise<IUserFeatureLimit[]> {
    return await this.model.find({ user_id: new mongoose.Types.ObjectId(userId) }).sort({ createdAt: -1 });
  }

  async findByUserAndFeature(userId: string, featureId: string): Promise<IUserFeatureLimit | null> {
    return await this.model.findOne({ 
      user_id: new mongoose.Types.ObjectId(userId), 
      feature_id: new mongoose.Types.ObjectId(featureId) 
    });
  }

  async upsertUserFeatureLimit(userId: string, featureId: string, data: Partial<IUserFeatureLimit>): Promise<IUserFeatureLimit> {
    return await this.model.findOneAndUpdate(
      { 
        user_id: new mongoose.Types.ObjectId(userId), 
        feature_id: new mongoose.Types.ObjectId(featureId) 
      },
      { 
        ...data,
        user_id: new mongoose.Types.ObjectId(userId),
        feature_id: new mongoose.Types.ObjectId(featureId),
        last_calculated: new Date()
      },
      { 
        upsert: true, 
        new: true 
      }
    );
  }

  async deleteByUser(userId: string): Promise<boolean> {
    const result = await this.model.deleteMany({ user_id: new mongoose.Types.ObjectId(userId) });
    return result.deletedCount > 0;
  }

  async findById(id: string): Promise<IUserFeatureLimit | null> {
    return await this.model.findById(id);
  }

  async create(data: Partial<IUserFeatureLimit>): Promise<IUserFeatureLimit> {
    return await this.model.create(data);
  }

  async update(id: string, data: Partial<IUserFeatureLimit>): Promise<IUserFeatureLimit | null> {
    return await this.model.findByIdAndUpdate(id, data, { new: true });
  }
}