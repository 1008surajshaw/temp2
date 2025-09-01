import { IFeatureRepository } from '../interfaces/IFeatureRepository';
import { Feature } from '../models/Feature';
import { BaseRepository } from './BaseRepository';

export class FeatureRepository extends BaseRepository<Feature> implements IFeatureRepository {
  constructor() {
    super(Feature);
  }

  async findByOrganization(organizationId: number): Promise<Feature[]> {
    return await this.model.findAll({
      where: { organization_id: organizationId } as any,
      order: [['createdAt', 'DESC']],
    });
  }

  async findByFeatureKey(organizationId: number, featureKey: string): Promise<Feature | null> {
    return await this.model.findOne({
      where: { 
        organization_id: organizationId,
        feature_key: featureKey 
      } as any,
    });
  }
}