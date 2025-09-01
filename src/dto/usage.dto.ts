export interface CreateUsageDto {
  user_id: number;
  feature_id: number;
  usage_count: number;
  usage_limit: number;
  period: string;
}

export interface UpdateUsageDto {
  usage_count?: number;
  usage_limit?: number;
}

export interface UsageResponseDto {
  id: number;
  user_id: number;
  feature_id: number;
  feature_name: string;
  feature_key: string;
  usage_count: number;
  usage_limit: number;
  period: string;
  percentage_used: number;
  createdAt: Date;
  updatedAt: Date;
}