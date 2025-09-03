import { CreateSubscriptionDto, UpdateSubscriptionDto, SubscriptionResponseDto } from '../dto/subscription.dto';

export interface ISubscriptionService {
  createSubscription(data: CreateSubscriptionDto): Promise<SubscriptionResponseDto>;
  updateSubscription(id: string, data: UpdateSubscriptionDto): Promise<SubscriptionResponseDto | null>;
  cancelSubscription(id: string): Promise<SubscriptionResponseDto | null>;
  getSubscriptionById(id: string): Promise<SubscriptionResponseDto | null>;
  getSubscriptionsByUser(userId: string): Promise<SubscriptionResponseDto[]>;
  getActiveSubscriptionsByUser(userId: string): Promise<SubscriptionResponseDto[]>;
  recalculateUserLimits(userId: string): Promise<void>;
}