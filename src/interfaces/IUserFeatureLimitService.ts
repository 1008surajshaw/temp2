export interface IUserFeatureLimitService {
  calculateUserFeatureLimits(userId: string): Promise<void>;
  getUserFeatureLimit(userId: string, featureId: string): Promise<{ limit: number; isUnlimited: boolean; currentUsage: number }>;
  checkFeatureUsageAllowed(userId: string, featureId: string, requestedUsage: number): Promise<boolean>;
  incrementUsage(userId: string, featureId: string, usageCount: number): Promise<void>;
  getUserAllFeatureLimits(userId: string): Promise<Array<{
    feature_id: string;
    feature_name: string;
    feature_key: string;
    total_limit: number;
    is_unlimited: boolean;
    current_usage: number;
    remaining: number;
  }>>;
}