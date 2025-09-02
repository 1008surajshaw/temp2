import { IOrganization } from '../models/Organization';

export interface IOrganizationRepository {
  create(data: Partial<IOrganization>): Promise<IOrganization>;
  update(id: string, data: Partial<IOrganization>): Promise<IOrganization | null>;
  findById(id: string): Promise<IOrganization | null>;
  findByName(name: string): Promise<IOrganization | null>;
}