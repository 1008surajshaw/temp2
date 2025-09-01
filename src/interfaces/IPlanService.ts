import { CreatePlanDto, UpdatePlanDto, PlanResponseDto } from '../dto/plan.dto';

export interface IPlanService {
  createPlan(data: CreatePlanDto): Promise<PlanResponseDto>;
  updatePlan(id: number, data: UpdatePlanDto): Promise<PlanResponseDto | null>;
  deletePlan(id: number): Promise<boolean>;
  getPlanById(id: number): Promise<PlanResponseDto | null>;
  getPlansByOrganization(organizationId: number): Promise<PlanResponseDto[]>;
}