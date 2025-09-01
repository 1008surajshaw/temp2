import { IOrganizationRepository } from '../interfaces/IOrganizationRepository';
import { Organization } from '../models/Organization';
import { BaseRepository } from './BaseRepository';

export class OrganizationRepository extends BaseRepository<Organization> implements IOrganizationRepository {
  constructor() {
    super(Organization);
  }

  async findAll(): Promise<Organization[]> {
    return await this.model.findAll({
      order: [['createdAt', 'DESC']],
    });
  }

  async findByName(name: string): Promise<Organization | null> {
    return await this.model.findOne({ where: { name } as any });
  }
}