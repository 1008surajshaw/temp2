import { CreateUsageDto, UpdateUsageDto, UsageResponseDto } from '../dto/usage.dto';

export interface IUsageService {
  createUsage(data: { user_id: string; feature_id: string; usage_count?: number }): Promise<{ success: boolean; message?: string; remaining?: number }>;
  getUsageByUserAndFeature(userId: string, featureId: string): Promise<{
    feature_id: string;
    feature_name: string;
    feature_key: string;
    total_limit: number;
    is_unlimited: boolean;
    current_usage: number;
    remaining: number;
  } | null>;
}