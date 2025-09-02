import { IOrganizationRepository } from '../interfaces/IOrganizationRepository';
import { Organization, IOrganization } from '../models/Organization';
import { BaseRepository } from './BaseRepository';

export class OrganizationRepository extends BaseRepository<IOrganization> implements IOrganizationRepository {
  constructor() {
    super(Organization);
  }

  async findByName(name: string): Promise<IOrganization | null> {
    return await this.model.findOne({ name });
  }

  async findById(id: string): Promise<IOrganization | null> {
    return await this.model.findById(id);
  }

  async create(data: Partial<IOrganization>): Promise<IOrganization> {
    return await this.model.create(data);
  }

  async update(id: string, data: Partial<IOrganization>): Promise<IOrganization | null> {
    return await this.model.findByIdAndUpdate(id, data, { new: true });
  }
}