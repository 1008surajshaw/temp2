import { ISubscriptionRepository } from '../interfaces/ISubscriptionRepository';
import { UserSubscription } from '../models/UserSubscription';
import { Plan } from '../models/Plan';
import { BaseRepository } from './BaseRepository';

export class SubscriptionRepository extends BaseRepository<UserSubscription> implements ISubscriptionRepository {
  constructor() {
    super(UserSubscription);
  }

  async findByUser(userId: number): Promise<UserSubscription[]> {
    return await this.model.findAll({
      where: { user_id: userId } as any,
      order: [['createdAt', 'DESC']],
    });
  }

  async findActiveByUser(userId: number): Promise<UserSubscription[]> {
    return await this.model.findAll({
      where: { 
        user_id: userId,
        status: 'active'
      } as any,
      order: [['createdAt', 'DESC']],
    });
  }

  async findWithPlan(id: number): Promise<UserSubscription | null> {
    return await this.model.findByPk(id, {
      include: [
        {
          model: Plan,
          as: 'plan',
        },
      ],
    });
  }
}