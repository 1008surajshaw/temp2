import { IOrganizationService } from '../interfaces/IOrganizationService';
import { IOrganizationRepository } from '../interfaces/IOrganizationRepository';
import { CreateOrganizationDto, UpdateOrganizationDto, OrganizationResponseDto } from '../dto/organization.dto';

export class OrganizationService implements IOrganizationService {
  constructor(private organizationRepository: IOrganizationRepository) {}

  async createOrganization(data: CreateOrganizationDto): Promise<OrganizationResponseDto> {
    const existingOrg = await this.organizationRepository.findByName(data.name);
    if (existingOrg) {
      throw new Error('Organization with this name already exists');
    }

    const organization = await this.organizationRepository.create(data);
    return this.mapToResponseDto(organization);
  }

  async updateOrganization(id: number, data: UpdateOrganizationDto): Promise<OrganizationResponseDto | null> {
    if (data.name) {
      const existingOrg = await this.organizationRepository.findByName(data.name);
      if (existingOrg && existingOrg.id !== id) {
        throw new Error('Organization name already in use');
      }
    }

    const organization = await this.organizationRepository.update(id, data);
    return organization ? this.mapToResponseDto(organization) : null;
  }

  async getOrganizationById(id: number): Promise<OrganizationResponseDto | null> {
    const organization = await this.organizationRepository.findById(id);
    return organization ? this.mapToResponseDto(organization) : null;
  }



  private mapToResponseDto(org: any): OrganizationResponseDto {
    return {
      id: org.id,
      name: org.name,
      description: org.description,
      is_active: org.is_active,
      createdAt: org.createdAt,
      updatedAt: org.updatedAt,
    };
  }
}