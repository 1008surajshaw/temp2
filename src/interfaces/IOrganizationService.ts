import { CreateOrganizationDto, UpdateOrganizationDto, OrganizationResponseDto } from '../dto/organization.dto';

export interface IOrganizationService {
  createOrganization(data: CreateOrganizationDto): Promise<OrganizationResponseDto>;
  updateOrganization(id: string, data: UpdateOrganizationDto): Promise<OrganizationResponseDto | null>;
  getOrganizationById(id: string): Promise<OrganizationResponseDto | null>;
}