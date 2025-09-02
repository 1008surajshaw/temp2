import { IFeatureRepository } from '../interfaces/IFeatureRepository';
import { Feature, IFeature } from '../models/Feature';
import { BaseRepository } from './BaseRepository';

export class FeatureRepository extends BaseRepository<IFeature> implements IFeatureRepository {
  constructor() {
    super(Feature);
  }

  async findByOrganization(organizationId: string): Promise<IFeature[]> {
    return await this.model.find({ organization_id: organizationId }).sort({ createdAt: -1 });
  }

  async findByFeatureKey(organizationId: string, featureKey: string): Promise<IFeature | null> {
    return await this.model.findOne({
      organization_id: organizationId,
      feature_key: featureKey,
    });
  }

  async findById(id: string): Promise<IFeature | null> {
    return await this.model.findById(id);
  }

  async create(data: Partial<IFeature>): Promise<IFeature> {
    return await this.model.create(data);
  }

  async update(id: string, data: Partial<IFeature>): Promise<IFeature | null> {
    return await this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return !!result;
  }
}