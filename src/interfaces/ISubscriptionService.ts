import { CreateSubscriptionDto, UpdateSubscriptionDto, SubscriptionResponseDto } from '../dto/subscription.dto';

export interface ISubscriptionService {
  createSubscription(data: CreateSubscriptionDto): Promise<SubscriptionResponseDto>;
  updateSubscription(id: number, data: UpdateSubscriptionDto): Promise<SubscriptionResponseDto | null>;
  cancelSubscription(id: number): Promise<SubscriptionResponseDto | null>;
  getSubscriptionById(id: number): Promise<SubscriptionResponseDto | null>;
  getSubscriptionsByUser(userId: number): Promise<SubscriptionResponseDto[]>;
  getActiveSubscriptionsByUser(userId: number): Promise<SubscriptionResponseDto[]>;
}