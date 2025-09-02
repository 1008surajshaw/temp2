import mongoose from 'mongoose';
import { IUsageService } from '../interfaces/IUsageService';
import { IUsageRepository } from '../interfaces/IUsageRepository';
import { IFeatureRepository } from '../interfaces/IFeatureRepository';
import { CreateUsageDto, UpdateUsageDto, UsageResponseDto } from '../dto/usage.dto';

export class UsageService implements IUsageService {
  constructor(
    private usageRepository: IUsageRepository,
    private featureRepository: IFeatureRepository
  ) {}

  async createUsage(data: CreateUsageDto): Promise<UsageResponseDto> {
    const usage = await this.usageRepository.create({
      user_id: new mongoose.Types.ObjectId(data.user_id),
      feature_id: new mongoose.Types.ObjectId(data.feature_id),
      usage_count: data.usage_count,
      usage_date: data.usage_date || new Date(),
    });

    const feature = await this.featureRepository.findById(data.feature_id);
    return this.mapToResponseDto(usage, feature);
  }

  async updateUsage(id: string, data: UpdateUsageDto): Promise<UsageResponseDto | null> {
    const usage = await this.usageRepository.update(id, data);
    if (!usage) return null;

    const feature = await this.featureRepository.findById((usage.feature_id as mongoose.Types.ObjectId).toString());
    return this.mapToResponseDto(usage, feature);
  }

  async getUsageById(id: string): Promise<UsageResponseDto | null> {
    const usage = await this.usageRepository.findById(id);
    if (!usage) return null;

    const feature = await this.featureRepository.findById((usage.feature_id as mongoose.Types.ObjectId).toString());
    return this.mapToResponseDto(usage, feature);
  }

  async getUsageByUser(userId: string): Promise<UsageResponseDto[]> {
    const usages = await this.usageRepository.findByUser(userId);
    const results = await Promise.all(
      usages.map(async (usage) => {
        const feature = await this.featureRepository.findById((usage.feature_id as mongoose.Types.ObjectId).toString());
        return this.mapToResponseDto(usage, feature);
      })
    );
    return results;
  }

  async getUsageByUserAndFeature(userId: string, featureId: string): Promise<UsageResponseDto[]> {
    const usages = await this.usageRepository.findByUserAndFeature(userId, featureId);
    const feature = await this.featureRepository.findById(featureId);
    return usages.map(usage => this.mapToResponseDto(usage, feature));
  }

  async getTotalUsageByUserAndFeature(userId: string, featureId: string): Promise<number> {
    return await this.usageRepository.getTotalUsageByUserAndFeature(userId, featureId);
  }

  private mapToResponseDto(usage: any, feature: any): UsageResponseDto {
    return {
      id: usage.id,
      user_id: (usage.user_id as mongoose.Types.ObjectId).toString(),
      feature_id: (usage.feature_id as mongoose.Types.ObjectId).toString(),
      feature_name: feature?.name || '',
      feature_key: feature?.feature_key || '',
      usage_count: usage.usage_count,
      usage_date: usage.usage_date,
      createdAt: usage.createdAt,
      updatedAt: usage.updatedAt,
    };
  }
}