import mongoose from 'mongoose';
import { IUsageRepository } from '../interfaces/IUsageRepository';
import { Usage, IUsage } from '../models/Usage';
import { BaseRepository } from './BaseRepository';

export class UsageRepository extends BaseRepository<IUsage> implements IUsageRepository {
  constructor() {
    super(Usage);
  }

  async findByUser(userId: string): Promise<IUsage[]> {
    return await this.model.find({ user_id: new mongoose.Types.ObjectId(userId) }).sort({ createdAt: -1 });
  }

  async findByUserAndFeature(userId: string, featureId: string): Promise<IUsage[]> {
    return await this.model.find({ 
      user_id: new mongoose.Types.ObjectId(userId), 
      feature_id: new mongoose.Types.ObjectId(featureId) 
    }).sort({ createdAt: -1 });
  }

  async findByFeature(featureId: string): Promise<IUsage[]> {
    return await this.model.find({ feature_id: new mongoose.Types.ObjectId(featureId) }).sort({ createdAt: -1 });
  }

  async getTotalUsageByUserAndFeature(userId: string, featureId: string): Promise<number> {
    const result = await this.model.aggregate([
      { 
        $match: { 
          user_id: new mongoose.Types.ObjectId(userId), 
          feature_id: new mongoose.Types.ObjectId(featureId) 
        } 
      },
      { 
        $group: { 
          _id: null, 
          total: { $sum: '$usage_count' } 
        } 
      }
    ]);
    return result[0]?.total || 0;
  }

  async findById(id: string): Promise<IUsage | null> {
    return await this.model.findById(id);
  }

  async create(data: Partial<IUsage>): Promise<IUsage> {
    return await this.model.create(data);
  }

  async update(id: string, data: Partial<IUsage>): Promise<IUsage | null> {
    return await this.model.findByIdAndUpdate(id, data, { new: true });
  }
}