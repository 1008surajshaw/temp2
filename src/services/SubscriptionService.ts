import mongoose from 'mongoose';
import { ISubscriptionService } from '../interfaces/ISubscriptionService';
import { ISubscriptionRepository } from '../interfaces/ISubscriptionRepository';
import { IPlanRepository } from '../interfaces/IPlanRepository';
import { IUserFeatureLimitService } from '../interfaces/IUserFeatureLimitService';
import { CreateSubscriptionDto, UpdateSubscriptionDto, SubscriptionResponseDto } from '../dto/subscription.dto';

export class SubscriptionService implements ISubscriptionService {
  constructor(
    private subscriptionRepository: ISubscriptionRepository,
    private planRepository: IPlanRepository,
    private userFeatureLimitService: IUserFeatureLimitService
  ) {}

  async createSubscription(data: CreateSubscriptionDto): Promise<SubscriptionResponseDto> {
    const plan = await this.planRepository.findById(data.plan_id);
    if (!plan) {
      throw new Error('Plan not found');
    }

    const subscription = await this.subscriptionRepository.create({
      user_id: new mongoose.Types.ObjectId(data.user_id),
      plan_id: new mongoose.Types.ObjectId(data.plan_id),
      start_date: data.start_date,
      end_date: data.end_date,
      is_active: data.is_active !== undefined ? data.is_active : true,
    });

    // Recalculate user feature limits after creating subscription
    await this.userFeatureLimitService.calculateUserFeatureLimits(data.user_id);

    return this.mapToResponseDto(subscription, plan);
  }

  async updateSubscription(id: string, data: UpdateSubscriptionDto): Promise<SubscriptionResponseDto | null> {
    const subscription = await this.subscriptionRepository.update(id, data);
    if (!subscription) return null;

    // Recalculate user feature limits after updating subscription
    const userId = (subscription.user_id as mongoose.Types.ObjectId).toString();
    await this.userFeatureLimitService.calculateUserFeatureLimits(userId);

    const plan = await this.planRepository.findById((subscription.plan_id as mongoose.Types.ObjectId).toString());
    return this.mapToResponseDto(subscription, plan);
  }

  async cancelSubscription(id: string): Promise<SubscriptionResponseDto | null> {
    const subscription = await this.subscriptionRepository.update(id, {
      is_active: false
    });
    if (!subscription) return null;

    // Recalculate user feature limits after cancelling subscription
    const userId = (subscription.user_id as mongoose.Types.ObjectId).toString();
    await this.userFeatureLimitService.calculateUserFeatureLimits(userId);

    const plan = await this.planRepository.findById((subscription.plan_id as mongoose.Types.ObjectId).toString());
    return this.mapToResponseDto(subscription, plan);
  }

  async getSubscriptionById(id: string): Promise<SubscriptionResponseDto | null> {
    const subscription = await this.subscriptionRepository.findById(id);
    if (!subscription) return null;

    const plan = await this.planRepository.findById((subscription.plan_id as mongoose.Types.ObjectId).toString());
    return this.mapToResponseDto(subscription, plan);
  }

  async getSubscriptionsByUser(userId: string): Promise<SubscriptionResponseDto[]> {
    const subscriptions = await this.subscriptionRepository.findByUser(userId);
    const results = await Promise.all(
      subscriptions.map(async (sub) => {
        const plan = await this.planRepository.findById((sub.plan_id as mongoose.Types.ObjectId).toString());
        return this.mapToResponseDto(sub, plan);
      })
    );
    return results;
  }

  async getActiveSubscriptionsByUser(userId: string): Promise<SubscriptionResponseDto[]> {
    const subscriptions = await this.subscriptionRepository.findActiveByUser(userId);
    const results = await Promise.all(
      subscriptions.map(async (sub) => {
        const plan = await this.planRepository.findById((sub.plan_id as mongoose.Types.ObjectId).toString());
        return this.mapToResponseDto(sub, plan);
      })
    );
    return results;
  }

  async recalculateUserLimits(userId: string): Promise<void> {
    await this.userFeatureLimitService.calculateUserFeatureLimits(userId);
  }

  private mapToResponseDto(subscription: any, plan: any): SubscriptionResponseDto {
    return {
      id: subscription.id,
      user_id: (subscription.user_id as mongoose.Types.ObjectId).toString(),
      plan_id: (subscription.plan_id as mongoose.Types.ObjectId).toString(),
      plan_name: plan?.name || '',
      start_date: subscription.start_date,
      end_date: subscription.end_date,
      is_active: subscription.is_active,
      createdAt: subscription.createdAt,
      updatedAt: subscription.updatedAt,
    };
  }
}