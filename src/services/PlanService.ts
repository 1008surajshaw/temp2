import mongoose from 'mongoose';
import { IPlanService } from '../interfaces/IPlanService';
import { IPlanRepository } from '../interfaces/IPlanRepository';
import { IFeatureRepository } from '../interfaces/IFeatureRepository';
import { CreatePlanDto, UpdatePlanDto, PlanResponseDto } from '../dto/plan.dto';
import { PlanFeature } from '../models/PlanFeature';

export class PlanService implements IPlanService {
  constructor(
    private planRepository: IPlanRepository,
    private featureRepository: IFeatureRepository
  ) {}

  async createPlan(data: CreatePlanDto): Promise<PlanResponseDto> {
    const plan = await this.planRepository.create({
      organization_id: new mongoose.Types.ObjectId(data.organization_id),
      name: data.name,
      description: data.description,
      price: data.price,
      billing_cycle: data.billing_cycle,
    });

    // Create plan features
    for (const feature of data.features) {
      await PlanFeature.create({
        plan_id: new mongoose.Types.ObjectId(plan.id),
        feature_id: new mongoose.Types.ObjectId(feature.feature_id),
        feature_limit: feature.feature_limit,
        is_unlimited: feature.is_unlimited,
      });
    }

    const planWithFeatures = await this.planRepository.findWithFeatures(plan.id);
    return this.mapToResponseDto(planWithFeatures!);
  }

  async updatePlan(id: string, data: UpdatePlanDto): Promise<PlanResponseDto | null> {
    const plan = await this.planRepository.update(id, {
      name: data.name,
      description: data.description,
      price: data.price,
      billing_cycle: data.billing_cycle,
      is_active: data.is_active,
    });

    if (!plan) return null;

    // Update features if provided
    if (data.features) {
      await PlanFeature.deleteMany({ plan_id: new mongoose.Types.ObjectId(id) });
      for (const feature of data.features) {
        await PlanFeature.create({
          plan_id: new mongoose.Types.ObjectId(id),
          feature_id: new mongoose.Types.ObjectId(feature.feature_id),
          feature_limit: feature.feature_limit,
          is_unlimited: feature.is_unlimited,
        });
      }
    }

    const planWithFeatures = await this.planRepository.findWithFeatures(id);
    return this.mapToResponseDto(planWithFeatures!);
  }

  async deletePlan(id: string): Promise<boolean> {
    return await this.planRepository.delete(id);
  }

  async getPlanById(id: string): Promise<PlanResponseDto | null> {
    const plan = await this.planRepository.findWithFeatures(id);
    return plan ? this.mapToResponseDto(plan) : null;
  }

  async getPlansByOrganization(organizationId: string): Promise<PlanResponseDto[]> {
    const plans = await this.planRepository.findByOrganization(organizationId);
    const plansWithFeatures = await Promise.all(
      plans.map(plan => this.planRepository.findWithFeatures(plan.id))
    );
    return plansWithFeatures.filter(Boolean).map(this.mapToResponseDto);
  }

  private mapToResponseDto(plan: any): PlanResponseDto {
    return {
      id: plan.id,
      organization_id: (plan.organization_id as mongoose.Types.ObjectId).toString(),
      name: plan.name,
      description: plan.description,
      price: plan.price,
      billing_cycle: plan.billing_cycle,
      is_active: plan.is_active,
      features: plan.planFeatures?.map((pf: any) => ({
        id: pf.id,
        feature_id: (pf.feature_id._id as mongoose.Types.ObjectId).toString(),
        feature_name: pf.feature_id.name,
        feature_key: pf.feature_id.feature_key,
        feature_limit: pf.feature_limit,
        is_unlimited: pf.is_unlimited,
      })) || [],
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
    };
  }
}