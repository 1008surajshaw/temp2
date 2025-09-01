import { Organization } from '../models/Organization';

export interface IOrganizationRepository {
  create(data: Partial<Organization>): Promise<Organization>;
  update(id: number, data: Partial<Organization>): Promise<Organization | null>;
  findById(id: number): Promise<Organization | null>;
  findAll(): Promise<Organization[]>;
  findByName(name: string): Promise<Organization | null>;
}