import { CreatePlanDto, UpdatePlanDto, PlanResponseDto } from '../dto/plan.dto';

export interface IPlanService {
  createPlan(data: CreatePlanDto): Promise<PlanResponseDto>;
  updatePlan(id: string, data: UpdatePlanDto): Promise<PlanResponseDto | null>;
  deletePlan(id: string): Promise<boolean>;
  getPlanById(id: string): Promise<PlanResponseDto | null>;
  getPlansByOrganization(organizationId: string): Promise<PlanResponseDto[]>;
}