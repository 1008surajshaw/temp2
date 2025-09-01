import { CreateUsageDto, UpdateUsageDto, UsageResponseDto } from '../dto/usage.dto';

export interface IUsageService {
  createUsage(data: CreateUsageDto): Promise<UsageResponseDto>;
  updateUsage(id: number, data: UpdateUsageDto): Promise<UsageResponseDto | null>;
  getUsageById(id: number): Promise<UsageResponseDto | null>;
  getUsageByUser(userId: number): Promise<UsageResponseDto[]>;
  getUsageByUserAndPeriod(userId: number, period: string): Promise<UsageResponseDto[]>;
  incrementUsage(userId: number, featureId: number, period: string, increment: number): Promise<UsageResponseDto | null>;
  checkUsageLimit(userId: number, featureId: number, period: string): Promise<boolean>;
}