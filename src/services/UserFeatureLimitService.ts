import mongoose from 'mongoose';
import { IUserFeatureLimitService } from '../interfaces/IUserFeatureLimitService';
import { IUserFeatureLimitRepository } from '../interfaces/IUserFeatureLimitRepository';
import { ISubscriptionRepository } from '../interfaces/ISubscriptionRepository';
import { IUsageRepository } from '../interfaces/IUsageRepository';
import { IFeatureRepository } from '../interfaces/IFeatureRepository';
import { PlanFeature } from '../models/PlanFeature';

export class UserFeatureLimitService implements IUserFeatureLimitService {
  constructor(
    private userFeatureLimitRepository: IUserFeatureLimitRepository,
    private subscriptionRepository: ISubscriptionRepository,
    private usageRepository: IUsageRepository,
    private featureRepository: IFeatureRepository
  ) {}

  async calculateUserFeatureLimits(userId: string): Promise<void> {
    // Get all active subscriptions for user
    const activeSubscriptions = await this.subscriptionRepository.findActiveByUser(userId);
    
    // Get all plan features for active subscriptions
    const featureLimits = new Map<string, { limit: number; isUnlimited: boolean }>();
    
    for (const subscription of activeSubscriptions) {
      const planFeatures = await PlanFeature.find({ 
        plan_id: subscription.plan_id 
      }).populate('feature_id');
      
      for (const planFeature of planFeatures) {
        const featureId = (planFeature.feature_id as any)._id.toString();
        const existing = featureLimits.get(featureId);
        
        if (planFeature.is_unlimited) {
          featureLimits.set(featureId, { limit: 0, isUnlimited: true });
        } else if (!existing?.isUnlimited) {
          const currentLimit = existing?.limit || 0;
          featureLimits.set(featureId, { 
            limit: currentLimit + planFeature.feature_limit, 
            isUnlimited: false 
          });
        }
      }
    }

    // Update user feature limits
    for (const [featureId, { limit, isUnlimited }] of featureLimits) {
      const currentUsage = await this.usageRepository.getTotalUsageByUserAndFeature(userId, featureId);
      
      await this.userFeatureLimitRepository.upsertUserFeatureLimit(userId, featureId, {
        total_limit: limit,
        is_unlimited: isUnlimited,
        current_usage: currentUsage,
      });
    }
  }

  async getUserFeatureLimit(userId: string, featureId: string): Promise<{ limit: number; isUnlimited: boolean; currentUsage: number }> {
    const userFeatureLimit = await this.userFeatureLimitRepository.findByUserAndFeature(userId, featureId);
    
    if (!userFeatureLimit) {
      // Recalculate if not found
      await this.calculateUserFeatureLimits(userId);
      const recalculated = await this.userFeatureLimitRepository.findByUserAndFeature(userId, featureId);
      
      if (!recalculated) {
        return { limit: 0, isUnlimited: false, currentUsage: 0 };
      }
      
      return {
        limit: recalculated.total_limit,
        isUnlimited: recalculated.is_unlimited,
        currentUsage: recalculated.current_usage,
      };
    }

    return {
      limit: userFeatureLimit.total_limit,
      isUnlimited: userFeatureLimit.is_unlimited,
      currentUsage: userFeatureLimit.current_usage,
    };
  }

  async checkFeatureUsageAllowed(userId: string, featureId: string, requestedUsage: number): Promise<boolean> {
    const { limit, isUnlimited, currentUsage } = await this.getUserFeatureLimit(userId, featureId);
    
    if (isUnlimited) return true;
    
    return (currentUsage + requestedUsage) <= limit;
  }

  async incrementUsage(userId: string, featureId: string, usageCount: number): Promise<void> {
    const userFeatureLimit = await this.userFeatureLimitRepository.findByUserAndFeature(userId, featureId);
    
    if (userFeatureLimit) {
      await this.userFeatureLimitRepository.update(userFeatureLimit.id, {
        current_usage: userFeatureLimit.current_usage + usageCount,
      });
    }
  }

  async getUserAllFeatureLimits(userId: string): Promise<Array<{
    feature_id: string;
    feature_name: string;
    feature_key: string;
    total_limit: number;
    is_unlimited: boolean;
    current_usage: number;
    remaining: number;
  }>> {
    const userFeatureLimits = await this.userFeatureLimitRepository.findByUser(userId);
    
    const results = await Promise.all(
      userFeatureLimits.map(async (ufl) => {
        const feature = await this.featureRepository.findById((ufl.feature_id as mongoose.Types.ObjectId).toString());
        
        return {
          feature_id: (ufl.feature_id as mongoose.Types.ObjectId).toString(),
          feature_name: feature?.name || '',
          feature_key: feature?.feature_key || '',
          total_limit: ufl.total_limit,
          is_unlimited: ufl.is_unlimited,
          current_usage: ufl.current_usage,
          remaining: ufl.is_unlimited ? -1 : Math.max(0, ufl.total_limit - ufl.current_usage),
        };
      })
    );

    return results;
  }
}