import { ISubscriptionRepository } from '../interfaces/ISubscriptionRepository';
import { UserSubscription, IUserSubscription } from '../models/UserSubscription';
import { BaseRepository } from './BaseRepository';

export class SubscriptionRepository extends BaseRepository<IUserSubscription> implements ISubscriptionRepository {
  constructor() {
    super(UserSubscription);
  }

  async findByUser(userId: string): Promise<IUserSubscription[]> {
    return await this.model.find({ user_id: userId }).sort({ createdAt: -1 });
  }

  async findActiveByUser(userId: string): Promise<IUserSubscription[]> {
    return await this.model.find({ 
      user_id: userId, 
      is_active: true,
      end_date: { $gte: new Date() }
    }).sort({ createdAt: -1 });
  }

  async findByPlan(planId: string): Promise<IUserSubscription[]> {
    return await this.model.find({ plan_id: planId }).sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<IUserSubscription | null> {
    return await this.model.findById(id);
  }

  async create(data: Partial<IUserSubscription>): Promise<IUserSubscription> {
    return await this.model.create(data);
  }

  async update(id: string, data: Partial<IUserSubscription>): Promise<IUserSubscription | null> {
    return await this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return !!result;
  }
}