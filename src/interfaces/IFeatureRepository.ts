import { Feature } from '../models/Feature';

export interface IFeatureRepository {
  create(data: Partial<Feature>): Promise<Feature>;
  update(id: number, data: Partial<Feature>): Promise<Feature | null>;
  delete(id: number): Promise<boolean>;
  findById(id: number): Promise<Feature | null>;
  findByOrganization(organizationId: number): Promise<Feature[]>;
  findByFeatureKey(organizationId: number, featureKey: string): Promise<Feature | null>;
}