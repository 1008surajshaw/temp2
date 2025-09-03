import { Request, Response } from 'express';
import { IUserFeatureLimitService } from '../interfaces/IUserFeatureLimitService';
import { ApiResponse } from '../types/common';

export class UsageController {
  constructor(private userFeatureLimitService: IUserFeatureLimitService) {}

  async createUsage(req: Request, res: Response): Promise<void> {
    try {
      const { user_id, feature_id, usage_count } = req.body;
      
      const result = await this.userFeatureLimitService.useFeature(
        user_id, 
        feature_id, 
        usage_count || 1
      );
      
      const response: ApiResponse = {
        success: result.success,
        data: result.success ? { remaining: result.remaining } : undefined,
        message: result.message
      };
      
      res.status(result.success ? 201 : 400).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      };
      res.status(500).json(response);
    }
  }

  async getUsageByUserAndFeature(req: Request, res: Response): Promise<void> {
    try {
      const { userId, featureId } = req.params;
      
      const usage = await this.userFeatureLimitService.getFeatureUsageByUser(userId, featureId);
      
      if (!usage) {
        const response: ApiResponse = {
          success: false,
          error: 'Feature usage not found'
        };
        res.status(404).json(response);
        return;
      }
      
      const response: ApiResponse = {
        success: true,
        data: usage
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      };
      res.status(500).json(response);
    }
  }
}