import { IPlan } from '../models/Plan';

export interface IPlanRepository {
  create(data: Partial<IPlan>): Promise<IPlan>;
  update(id: string, data: Partial<IPlan>): Promise<IPlan | null>;
  delete(id: string): Promise<boolean>;
  findById(id: string): Promise<IPlan | null>;
  findByOrganization(organizationId: string): Promise<IPlan[]>;
  findWithFeatures(id: string): Promise<any | null>;
}