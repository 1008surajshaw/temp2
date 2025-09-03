import mongoose from 'mongoose';
import { IUserFeatureLimitService } from '../interfaces/IUserFeatureLimitService';
import { IUserFeatureLimitRepository } from '../interfaces/IUserFeatureLimitRepository';
import { ISubscriptionRepository } from '../interfaces/ISubscriptionRepository';
import { IFeatureRepository } from '../interfaces/IFeatureRepository';
import { PlanFeature } from '../models/PlanFeature';

export class UserFeatureLimitService implements IUserFeatureLimitService {
  constructor(
    private userFeatureLimitRepository: IUserFeatureLimitRepository,
    private subscriptionRepository: ISubscriptionRepository,
    private featureRepository: IFeatureRepository
  ) {}

  async calculateUserFeatureLimits(userId: string): Promise<void> {
    // Get all active subscriptions for user
    const activeSubscriptions = await this.subscriptionRepository.findActiveByUser(userId);
    
    if (activeSubscriptions.length === 0) {
      // No active subscriptions, clear all limits
      await this.userFeatureLimitRepository.deleteByUser(userId);
      return;
    }
    
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

    // Update user feature limits (preserve current usage)
    for (const [featureId, { limit, isUnlimited }] of featureLimits) {
      const existingLimit = await this.userFeatureLimitRepository.findByUserAndFeature(userId, featureId);
      const currentUsage = existingLimit?.current_usage || 0;
      
      await this.userFeatureLimitRepository.upsertUserFeatureLimit(userId, featureId, {
        total_limit: limit,
        is_unlimited: isUnlimited,
        current_usage: currentUsage,
      });
    }
  }

  async getUserFeatureLimit(userId: string, featureId: string): Promise<{ limit: number; isUnlimited: boolean; currentUsage: number }> {
    let userFeatureLimit = await this.userFeatureLimitRepository.findByUserAndFeature(userId, featureId);
    
    if (!userFeatureLimit) {
      // Create default limit if no subscriptions exist
      await this.calculateUserFeatureLimits(userId);
      userFeatureLimit = await this.userFeatureLimitRepository.findByUserAndFeature(userId, featureId);
      
      if (!userFeatureLimit) {
        // Create with zero limit if no subscription provides this feature
        userFeatureLimit = await this.userFeatureLimitRepository.upsertUserFeatureLimit(userId, featureId, {
          total_limit: 0,
          is_unlimited: false,
          current_usage: 0,
        });
      }
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

  async useFeature(userId: string, featureId: string, usageCount: number = 1): Promise<{ success: boolean; message?: string; remaining?: number }> {
    // Get or create feature limit
    const { limit, isUnlimited, currentUsage } = await this.getUserFeatureLimit(userId, featureId);
    
    // Check if usage is allowed
    if (!isUnlimited && (currentUsage + usageCount) > limit) {
      return {
        success: false,
        message: `Usage limit exceeded. Current: ${currentUsage}, Limit: ${limit}, Requested: ${usageCount}`
      };
    }
    
    // Update usage
    const userFeatureLimit = await this.userFeatureLimitRepository.findByUserAndFeature(userId, featureId);
    if (userFeatureLimit) {
      await this.userFeatureLimitRepository.update(userFeatureLimit.id, {
        current_usage: userFeatureLimit.current_usage + usageCount,
      });
    }
    
    const newRemaining = isUnlimited ? -1 : Math.max(0, limit - (currentUsage + usageCount));
    
    return {
      success: true,
      message: 'Feature used successfully',
      remaining: newRemaining
    };
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
    // Ensure limits are calculated
    await this.calculateUserFeatureLimits(userId);
    
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

  async getFeatureUsageByUser(userId: string, featureId: string): Promise<{
    feature_id: string;
    feature_name: string;
    feature_key: string;
    total_limit: number;
    is_unlimited: boolean;
    current_usage: number;
    remaining: number;
  } | null> {
    const userFeatureLimit = await this.userFeatureLimitRepository.findByUserAndFeature(userId, featureId);
    if (!userFeatureLimit) return null;
    
    const feature = await this.featureRepository.findById(featureId);
    
    return {
      feature_id: featureId,
      feature_name: feature?.name || '',
      feature_key: feature?.feature_key || '',
      total_limit: userFeatureLimit.total_limit,
      is_unlimited: userFeatureLimit.is_unlimited,
      current_usage: userFeatureLimit.current_usage,
      remaining: userFeatureLimit.is_unlimited ? -1 : Math.max(0, userFeatureLimit.total_limit - userFeatureLimit.current_usage),
    };
  }
}