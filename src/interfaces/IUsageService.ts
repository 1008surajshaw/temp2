import { CreateUsageDto, UpdateUsageDto, UsageResponseDto } from '../dto/usage.dto';

export interface IUsageService {
  createUsage(data: CreateUsageDto): Promise<UsageResponseDto>;
  updateUsage(id: string, data: UpdateUsageDto): Promise<UsageResponseDto | null>;
  getUsageById(id: string): Promise<UsageResponseDto | null>;
  getUsageByUser(userId: string): Promise<UsageResponseDto[]>;
  getUsageByUserAndFeature(userId: string, featureId: string): Promise<UsageResponseDto[]>;
  getTotalUsageByUserAndFeature(userId: string, featureId: string): Promise<number>;
}