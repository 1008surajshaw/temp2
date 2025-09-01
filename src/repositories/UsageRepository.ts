import { IUsageRepository } from '../interfaces/IUsageRepository';
import { Usage } from '../models/Usage';
import { Feature } from '../models/Feature';
import { BaseRepository } from './BaseRepository';

export class UsageRepository extends BaseRepository<Usage> implements IUsageRepository {
  constructor() {
    super(Usage);
  }

  async findByUser(userId: number): Promise<Usage[]> {
    return await this.model.findAll({
      where: { user_id: userId } as any,
      include: [
        {
          model: Feature,
          as: 'feature',
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  async findByUserAndFeature(userId: number, featureId: number, period: string): Promise<Usage | null> {
    return await this.model.findOne({
      where: { 
        user_id: userId,
        feature_id: featureId,
        period: period
      } as any,
    });
  }

  async findByUserAndPeriod(userId: number, period: string): Promise<Usage[]> {
    return await this.model.findAll({
      where: { 
        user_id: userId,
        period: period
      } as any,
      include: [
        {
          model: Feature,
          as: 'feature',
        },
      ],
    });
  }

  async incrementUsage(userId: number, featureId: number, period: string, increment: number): Promise<Usage | null> {
    const usage = await this.findByUserAndFeature(userId, featureId, period);
    if (usage) {
      return await this.update(usage.id, {
        usage_count: usage.usage_count + increment
      });
    }
    return null;
  }
}