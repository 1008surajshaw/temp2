import { Plan } from '../models/Plan';

export interface IPlanRepository {
  create(data: Partial<Plan>): Promise<Plan>;
  update(id: number, data: Partial<Plan>): Promise<Plan | null>;
  delete(id: number): Promise<boolean>;
  findById(id: number): Promise<Plan | null>;
  findByOrganization(organizationId: number): Promise<Plan[]>;
  findWithFeatures(id: number): Promise<Plan | null>;
}