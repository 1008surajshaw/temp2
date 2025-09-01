export interface CreateOrganizationDto {
  name: string;
  description?: string;
}

export interface UpdateOrganizationDto {
  name?: string;
  description?: string;
  is_active?: boolean;
}

export interface OrganizationResponseDto {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}