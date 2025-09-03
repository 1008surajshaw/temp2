import { Request, Response } from 'express';
import { IUserFeatureLimitService } from '../interfaces/IUserFeatureLimitService';
import { ApiResponse } from '../types/common';

export class UserFeatureLimitController {
  constructor(private userFeatureLimitService: IUserFeatureLimitService) {}

  async getUserFeatureLimits(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      const limits = await this.userFeatureLimitService.getUserAllFeatureLimits(userId);
      
      const response: ApiResponse = {
        success: true,
        data: limits
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

  async useFeature(req: Request, res: Response): Promise<void> {
    try {
      const { userId, featureId } = req.params;
      const { usageCount } = req.body;
      
      const result = await this.userFeatureLimitService.useFeature(
        userId, 
        featureId, 
        usageCount || 1
      );
      
      const response: ApiResponse = {
        success: result.success,
        data: result.success ? { remaining: result.remaining } : undefined,
        message: result.message
      };
      
      res.status(result.success ? 200 : 400).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      };
      res.status(500).json(response);
    }
  }

  async getFeatureUsage(req: Request, res: Response): Promise<void> {
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

  async recalculateUserLimits(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      await this.userFeatureLimitService.calculateUserFeatureLimits(userId);
      
      const response: ApiResponse = {
        success: true,
        message: 'User feature limits recalculated successfully'
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