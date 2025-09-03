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

  async checkFeatureUsage(req: Request, res: Response): Promise<void> {
    try {
      const { userId, featureId } = req.params;
      const { requestedUsage } = req.body;
      
      const isAllowed = await this.userFeatureLimitService.checkFeatureUsageAllowed(
        userId, 
        featureId, 
        requestedUsage || 1
      );
      
      const response: ApiResponse = {
        success: true,
        data: { allowed: isAllowed }
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