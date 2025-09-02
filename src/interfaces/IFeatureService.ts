import { CreateFeatureDto, UpdateFeatureDto, FeatureResponseDto } from '../dto/feature.dto';

export interface IFeatureService {
  createFeature(data: CreateFeatureDto): Promise<FeatureResponseDto>;
  updateFeature(id: string, data: UpdateFeatureDto): Promise<FeatureResponseDto | null>;
  deleteFeature(id: string): Promise<boolean>;
  getFeatureById(id: string): Promise<FeatureResponseDto | null>;
  getFeaturesByOrganization(organizationId: string): Promise<FeatureResponseDto[]>;
  toggleFeatureStatus(id: string): Promise<FeatureResponseDto | null>;
}