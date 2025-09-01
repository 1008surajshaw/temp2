import { CreateOrganizationDto, UpdateOrganizationDto, OrganizationResponseDto } from '../dto/organization.dto';

export interface IOrganizationService {
  createOrganization(data: CreateOrganizationDto): Promise<OrganizationResponseDto>;
  updateOrganization(id: number, data: UpdateOrganizationDto): Promise<OrganizationResponseDto | null>;
  getOrganizationById(id: number): Promise<OrganizationResponseDto | null>;
}