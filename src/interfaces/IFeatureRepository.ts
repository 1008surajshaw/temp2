import { IFeature } from '../models/Feature';

export interface IFeatureRepository {
  create(data: Partial<IFeature>): Promise<IFeature>;
  update(id: string, data: Partial<IFeature>): Promise<IFeature | null>;
  delete(id: string): Promise<boolean>;
  findById(id: string): Promise<IFeature | null>;
  findByOrganization(organizationId: string): Promise<IFeature[]>;
  findByFeatureKey(organizationId: string, featureKey: string): Promise<IFeature | null>;
}