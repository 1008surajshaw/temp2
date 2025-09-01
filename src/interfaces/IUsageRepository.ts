import { Usage } from '../models/Usage';

export interface IUsageRepository {
  create(data: Partial<Usage>): Promise<Usage>;
  update(id: number, data: Partial<Usage>): Promise<Usage | null>;
  findById(id: number): Promise<Usage | null>;
  findByUser(userId: number): Promise<Usage[]>;
  findByUserAndFeature(userId: number, featureId: number, period: string): Promise<Usage | null>;
  findByUserAndPeriod(userId: number, period: string): Promise<Usage[]>;
  incrementUsage(userId: number, featureId: number, period: string, increment: number): Promise<Usage | null>;
}