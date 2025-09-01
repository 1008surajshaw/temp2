import { IPlanRepository } from '../interfaces/IPlanRepository';
import { Plan } from '../models/Plan';
import { PlanFeature } from '../models/PlanFeature';
import { Feature } from '../models/Feature';
import { BaseRepository } from './BaseRepository';

export class PlanRepository extends BaseRepository<Plan> implements IPlanRepository {
  constructor() {
    super(Plan);
  }

  async findByOrganization(organizationId: number): Promise<Plan[]> {
    return await this.model.findAll({
      where: { organization_id: organizationId } as any,
      order: [['createdAt', 'DESC']],
    });
  }

  async findWithFeatures(id: number): Promise<Plan | null> {
    return await this.model.findByPk(id, {
      include: [
        {
          model: PlanFeature,
          as: 'planFeatures',
          include: [
            {
              model: Feature,
              as: 'feature',
            },
          ],
        },
      ],
    });
  }
}