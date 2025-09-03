import { IUserFeatureLimit } from '../models/UserFeatureLimit';

export interface IUserFeatureLimitRepository {
  create(data: Partial<IUserFeatureLimit>): Promise<IUserFeatureLimit>;
  update(id: string, data: Partial<IUserFeatureLimit>): Promise<IUserFeatureLimit | null>;
  findById(id: string): Promise<IUserFeatureLimit | null>;
  findByUser(userId: string): Promise<IUserFeatureLimit[]>;
  findByUserAndFeature(userId: string, featureId: string): Promise<IUserFeatureLimit | null>;
  upsertUserFeatureLimit(userId: string, featureId: string, data: Partial<IUserFeatureLimit>): Promise<IUserFeatureLimit>;
  deleteByUser(userId: string): Promise<boolean>;
}