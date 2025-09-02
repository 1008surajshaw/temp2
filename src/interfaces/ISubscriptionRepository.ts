import { IUserSubscription } from '../models/UserSubscription';

export interface ISubscriptionRepository {
  create(data: Partial<IUserSubscription>): Promise<IUserSubscription>;
  update(id: string, data: Partial<IUserSubscription>): Promise<IUserSubscription | null>;
  delete(id: string): Promise<boolean>;
  findById(id: string): Promise<IUserSubscription | null>;
  findByUser(userId: string): Promise<IUserSubscription[]>;
  findActiveByUser(userId: string): Promise<IUserSubscription[]>;
  findByPlan(planId: string): Promise<IUserSubscription[]>;
}