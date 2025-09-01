import { UserSubscription } from '../models/UserSubscription';

export interface ISubscriptionRepository {
  create(data: Partial<UserSubscription>): Promise<UserSubscription>;
  update(id: number, data: Partial<UserSubscription>): Promise<UserSubscription | null>;
  delete(id: number): Promise<boolean>;
  findById(id: number): Promise<UserSubscription | null>;
  findByUser(userId: number): Promise<UserSubscription[]>;
  findActiveByUser(userId: number): Promise<UserSubscription[]>;
  findWithPlan(id: number): Promise<UserSubscription | null>;
}