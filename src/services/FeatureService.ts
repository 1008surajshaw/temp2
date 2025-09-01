import { IFeatureService } from '../interfaces/IFeatureService';
import { IFeatureRepository } from '../interfaces/IFeatureRepository';
import { IOrganizationRepository } from '../interfaces/IOrganizationRepository';
import { CreateFeatureDto, UpdateFeatureDto, FeatureResponseDto } from '../dto/feature.dto';

export class FeatureService implements IFeatureService {
  constructor(
    private featureRepository: IFeatureRepository,
    private organizationRepository: IOrganizationRepository
  ) {}

  async createFeature(data: CreateFeatureDto): Promise<FeatureResponseDto> {
    const organization = await this.organizationRepository.findById(data.organization_id);
    if (!organization) {
      throw new Error('Organization not found');
    }

    const existingFeature = await this.featureRepository.findByFeatureKey(
      data.organization_id, 
      data.feature_key
    );
    if (existingFeature) {
      throw new Error('Feature key already exists in this organization');
    }

    const feature = await this.featureRepository.create(data);
    return this.mapToResponseDto(feature);
  }

  async updateFeature(id: number, data: UpdateFeatureDto): Promise<FeatureResponseDto | null> {
    const existingFeature = await this.featureRepository.findById(id);
    if (!existingFeature) {
      return null;
    }

    if (data.feature_key) {
      const duplicateFeature = await this.featureRepository.findByFeatureKey(
        existingFeature.organization_id,
        data.feature_key
      );
      if (duplicateFeature && duplicateFeature.id !== id) {
        throw new Error('Feature key already exists in this organization');
      }
    }

    const feature = await this.featureRepository.update(id, data);
    return feature ? this.mapToResponseDto(feature) : null;
  }

  async deleteFeature(id: number): Promise<boolean> {
    return await this.featureRepository.delete(id);
  }

  async getFeatureById(id: number): Promise<FeatureResponseDto | null> {
    const feature = await this.featureRepository.findById(id);
    return feature ? this.mapToResponseDto(feature) : null;
  }

  async getFeaturesByOrganization(organizationId: number): Promise<FeatureResponseDto[]> {
    const features = await this.featureRepository.findByOrganization(organizationId);
    return features.map(this.mapToResponseDto);
  }

  async toggleFeatureStatus(id: number): Promise<FeatureResponseDto | null> {
    const feature = await this.featureRepository.findById(id);
    if (!feature) {
      return null;
    }

    const updatedFeature = await this.featureRepository.update(id, {
      is_active: !feature.is_active
    });
    return updatedFeature ? this.mapToResponseDto(updatedFeature) : null;
  }

  private mapToResponseDto(feature: any): FeatureResponseDto {
    return {
      id: feature.id,
      organization_id: feature.organization_id,
      name: feature.name,
      feature_key: feature.feature_key,
      description: feature.description,
      is_active: feature.is_active,
      createdAt: feature.createdAt,
      updatedAt: feature.updatedAt,
    };
  }
}