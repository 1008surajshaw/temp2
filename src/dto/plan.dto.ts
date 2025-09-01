export interface CreatePlanDto {
  organization_id: number;
  name: string;
  description?: string;
  price: number;
  billing_cycle: 'monthly' | 'yearly';
  features: PlanFeatureDto[];
}

export interface UpdatePlanDto {
  name?: string;
  description?: string;
  price?: number;
  billing_cycle?: 'monthly' | 'yearly';
  is_active?: boolean;
  features?: PlanFeatureDto[];
}

export interface PlanFeatureDto {
  feature_id: number;
  feature_limit: number;
  is_unlimited: boolean;
}

export interface PlanResponseDto {
  id: number;
  organization_id: number;
  name: string;
  description: string;
  price: number;
  billing_cycle: 'monthly' | 'yearly';
  is_active: boolean;
  features: PlanFeatureResponseDto[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PlanFeatureResponseDto {
  id: number;
  feature_id: number;
  feature_name: string;
  feature_key: string;
  feature_limit: number;
  is_unlimited: boolean;
}