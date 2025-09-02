import mongoose from 'mongoose';
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

    const feature = await this.featureRepository.create({
      ...data,
      organization_id: new mongoose.Types.ObjectId(data.organization_id)
    });
    return this.mapToResponseDto(feature);
  }

  async updateFeature(id: string, data: UpdateFeatureDto): Promise<FeatureResponseDto | null> {
    const existingFeature = await this.featureRepository.findById(id);
    if (!existingFeature) {
      return null;
    }

    if (data.feature_key) {
      const duplicateFeature = await this.featureRepository.findByFeatureKey(
        (existingFeature.organization_id as mongoose.Types.ObjectId).toString(),
        data.feature_key
      );
      if (duplicateFeature && (duplicateFeature._id as mongoose.Types.ObjectId).toString() !== id) {
        throw new Error('Feature key already exists in this organization');
      }
    }

    const feature = await this.featureRepository.update(id, data);
    return feature ? this.mapToResponseDto(feature) : null;
  }

  async deleteFeature(id: string): Promise<boolean> {
    return await this.featureRepository.delete(id);
  }

  async getFeatureById(id: string): Promise<FeatureResponseDto | null> {
    const feature = await this.featureRepository.findById(id);
    return feature ? this.mapToResponseDto(feature) : null;
  }

  async getFeaturesByOrganization(organizationId: string): Promise<FeatureResponseDto[]> {
    const features = await this.featureRepository.findByOrganization(organizationId);
    return features.map(this.mapToResponseDto);
  }

  async toggleFeatureStatus(id: string): Promise<FeatureResponseDto | null> {
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
      id: feature.id || (feature._id as mongoose.Types.ObjectId).toString(),
      organization_id: (feature.organization_id as mongoose.Types.ObjectId).toString(),
      name: feature.name,
      feature_key: feature.feature_key,
      description: feature.description,
      is_active: feature.is_active,
      createdAt: feature.createdAt,
      updatedAt: feature.updatedAt,
    };
  }
}