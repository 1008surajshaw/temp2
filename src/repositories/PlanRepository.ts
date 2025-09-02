import { IPlanRepository } from '../interfaces/IPlanRepository';
import { Plan, IPlan } from '../models/Plan';
import { BaseRepository } from './BaseRepository';

export class PlanRepository extends BaseRepository<IPlan> implements IPlanRepository {
  constructor() {
    super(Plan);
  }

  async findByOrganization(organizationId: string): Promise<IPlan[]> {
    return await this.model.find({ organization_id: organizationId }).sort({ createdAt: -1 });
  }

  async findWithFeatures(id: string): Promise<IPlan | null> {
    return await this.model.findById(id).populate('features');
  }

  async findById(id: string): Promise<IPlan | null> {
    return await this.model.findById(id);
  }

  async create(data: Partial<IPlan>): Promise<IPlan> {
    return await this.model.create(data);
  }

  async update(id: string, data: Partial<IPlan>): Promise<IPlan | null> {
    return await this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return !!result;
  }
}