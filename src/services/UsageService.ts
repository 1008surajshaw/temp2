import { IUsageService } from '../interfaces/IUsageService';
import { IUsageRepository } from '../interfaces/IUsageRepository';
import { CreateUsageDto, UpdateUsageDto, UsageResponseDto } from '../dto/usage.dto';

export class UsageService implements IUsageService {
  constructor(private usageRepository: IUsageRepository) {}

  async createUsage(data: CreateUsageDto): Promise<UsageResponseDto> {
    const usage = await this.usageRepository.create(data);
    const usageWithFeature = await this.usageRepository.findById(usage.id);
    return this.mapToResponseDto(usageWithFeature!);
  }

  async updateUsage(id: number, data: UpdateUsageDto): Promise<UsageResponseDto | null> {
    const usage = await this.usageRepository.update(id, data);
    if (!usage) return null;

    const usageWithFeature = await this.usageRepository.findById(id);
    return this.mapToResponseDto(usageWithFeature!);
  }

  async getUsageById(id: number): Promise<UsageResponseDto | null> {
    const usage = await this.usageRepository.findById(id);
    return usage ? this.mapToResponseDto(usage) : null;
  }

  async getUsageByUser(userId: number): Promise<UsageResponseDto[]> {
    const usages = await this.usageRepository.findByUser(userId);
    return usages.map(this.mapToResponseDto);
  }

  async getUsageByUserAndPeriod(userId: number, period: string): Promise<UsageResponseDto[]> {
    const usages = await this.usageRepository.findByUserAndPeriod(userId, period);
    return usages.map(this.mapToResponseDto);
  }

  async incrementUsage(userId: number, featureId: number, period: string, increment: number): Promise<UsageResponseDto | null> {
    const usage = await this.usageRepository.incrementUsage(userId, featureId, period, increment);
    return usage ? this.mapToResponseDto(usage) : null;
  }

  async checkUsageLimit(userId: number, featureId: number, period: string): Promise<boolean> {
    const usage = await this.usageRepository.findByUserAndFeature(userId, featureId, period);
    if (!usage) return true; // No usage record means within limit
    
    return usage.usage_count < usage.usage_limit;
  }

  private mapToResponseDto(usage: any): UsageResponseDto {
    const percentageUsed = usage.usage_limit > 0 
      ? Math.round((usage.usage_count / usage.usage_limit) * 100)
      : 0;

    return {
      id: usage.id,
      user_id: usage.user_id,
      feature_id: usage.feature_id,
      feature_name: usage.feature?.name || '',
      feature_key: usage.feature?.feature_key || '',
      usage_count: usage.usage_count,
      usage_limit: usage.usage_limit,
      period: usage.period,
      percentage_used: percentageUsed,
      createdAt: usage.createdAt,
      updatedAt: usage.updatedAt,
    };
  }
}