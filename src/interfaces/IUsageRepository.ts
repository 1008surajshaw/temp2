import { IUsage } from '../models/Usage';

export interface IUsageRepository {
  create(data: Partial<IUsage>): Promise<IUsage>;
  update(id: string, data: Partial<IUsage>): Promise<IUsage | null>;
  findById(id: string): Promise<IUsage | null>;
  findByUser(userId: string): Promise<IUsage[]>;
  findByUserAndFeature(userId: string, featureId: string): Promise<IUsage[]>;
  findByFeature(featureId: string): Promise<IUsage[]>;
  getTotalUsageByUserAndFeature(userId: string, featureId: string): Promise<number>;
}