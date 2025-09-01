import { ISubscriptionService } from '../interfaces/ISubscriptionService';
import { ISubscriptionRepository } from '../interfaces/ISubscriptionRepository';
import { IPlanRepository } from '../interfaces/IPlanRepository';
import { CreateSubscriptionDto, UpdateSubscriptionDto, SubscriptionResponseDto } from '../dto/subscription.dto';

export class SubscriptionService implements ISubscriptionService {
  constructor(
    private subscriptionRepository: ISubscriptionRepository,
    private planRepository: IPlanRepository
  ) {}

  async createSubscription(data: CreateSubscriptionDto): Promise<SubscriptionResponseDto> {
    const plan = await this.planRepository.findById(data.plan_id);
    if (!plan) {
      throw new Error('Plan not found');
    }

    const subscription = await this.subscriptionRepository.create({
      user_id: data.user_id,
      plan_id: data.plan_id,
      start_date: data.start_date,
      end_date: data.end_date,
      auto_renew: data.auto_renew || true,
      status: 'active',
    });

    const subscriptionWithPlan = await this.subscriptionRepository.findWithPlan(subscription.id);
    return this.mapToResponseDto(subscriptionWithPlan!);
  }

  async updateSubscription(id: number, data: UpdateSubscriptionDto): Promise<SubscriptionResponseDto | null> {
    const subscription = await this.subscriptionRepository.update(id, data);
    if (!subscription) return null;

    const subscriptionWithPlan = await this.subscriptionRepository.findWithPlan(id);
    return this.mapToResponseDto(subscriptionWithPlan!);
  }

  async cancelSubscription(id: number): Promise<SubscriptionResponseDto | null> {
    const subscription = await this.subscriptionRepository.update(id, {
      status: 'cancelled'
    });
    if (!subscription) return null;

    const subscriptionWithPlan = await this.subscriptionRepository.findWithPlan(id);
    return this.mapToResponseDto(subscriptionWithPlan!);
  }

  async getSubscriptionById(id: number): Promise<SubscriptionResponseDto | null> {
    const subscription = await this.subscriptionRepository.findWithPlan(id);
    return subscription ? this.mapToResponseDto(subscription) : null;
  }

  async getSubscriptionsByUser(userId: number): Promise<SubscriptionResponseDto[]> {
    const subscriptions = await this.subscriptionRepository.findByUser(userId);
    const subscriptionsWithPlan = await Promise.all(
      subscriptions.map(sub => this.subscriptionRepository.findWithPlan(sub.id))
    );
    return subscriptionsWithPlan.filter(Boolean).map(this.mapToResponseDto);
  }

  async getActiveSubscriptionsByUser(userId: number): Promise<SubscriptionResponseDto[]> {
    const subscriptions = await this.subscriptionRepository.findActiveByUser(userId);
    const subscriptionsWithPlan = await Promise.all(
      subscriptions.map(sub => this.subscriptionRepository.findWithPlan(sub.id))
    );
    return subscriptionsWithPlan.filter(Boolean).map(this.mapToResponseDto);
  }

  private mapToResponseDto(subscription: any): SubscriptionResponseDto {
    return {
      id: subscription.id,
      user_id: subscription.user_id,
      plan_id: subscription.plan_id,
      plan_name: subscription.plan?.name || '',
      status: subscription.status,
      start_date: subscription.start_date,
      end_date: subscription.end_date,
      auto_renew: subscription.auto_renew,
      createdAt: subscription.createdAt,
      updatedAt: subscription.updatedAt,
    };
  }
}