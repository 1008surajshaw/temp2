import { CreateFeatureDto, UpdateFeatureDto, FeatureResponseDto } from '../dto/feature.dto';

export interface IFeatureService {
  createFeature(data: CreateFeatureDto): Promise<FeatureResponseDto>;
  updateFeature(id: number, data: UpdateFeatureDto): Promise<FeatureResponseDto | null>;
  deleteFeature(id: number): Promise<boolean>;
  getFeatureById(id: number): Promise<FeatureResponseDto | null>;
  getFeaturesByOrganization(organizationId: number): Promise<FeatureResponseDto[]>;
  toggleFeatureStatus(id: number): Promise<FeatureResponseDto | null>;
}