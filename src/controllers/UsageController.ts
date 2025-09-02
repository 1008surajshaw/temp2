import { Request, Response } from 'express';
import { IUsageService } from '../interfaces/IUsageService';
import { CreateUsageDto, UpdateUsageDto } from '../dto/usage.dto';
import { ApiResponse } from '../types/common';

export class UsageController {
  constructor(private usageService: IUsageService) {}

  async createUsage(req: Request, res: Response): Promise<void> {
    try {
      const usageData: CreateUsageDto = req.body;
      const usage = await this.usageService.createUsage(usageData);
      
      const response: ApiResponse = {
        success: true,
        data: usage,
        message: 'Usage record created successfully'
      };
      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      };
      res.status(400).json(response);
    }
  }

  async getUsageById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const usage = await this.usageService.getUsageById(id);
      
      if (!usage) {
        const response: ApiResponse = {
          success: false,
          error: 'Usage record not found'
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

  async getUsageByUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      const usages = await this.usageService.getUsageByUser(userId);
      
      const response: ApiResponse = {
        success: true,
        data: usages
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

  async getUsageByUserAndFeature(req: Request, res: Response): Promise<void> {
    try {
      const { userId, featureId } = req.params;
      const usages = await this.usageService.getUsageByUserAndFeature(userId, featureId);
      
      const response: ApiResponse = {
        success: true,
        data: usages
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

  async getTotalUsageByUserAndFeature(req: Request, res: Response): Promise<void> {
    try {
      const { userId, featureId } = req.params;
      const total = await this.usageService.getTotalUsageByUserAndFeature(userId, featureId);
      
      const response: ApiResponse = {
        success: true,
        data: { total }
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

  async updateUsage(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const usageData: UpdateUsageDto = req.body;
      const usage = await this.usageService.updateUsage(id, usageData);
      
      if (!usage) {
        const response: ApiResponse = {
          success: false,
          error: 'Usage record not found'
        };
        res.status(404).json(response);
        return;
      }
      
      const response: ApiResponse = {
        success: true,
        data: usage,
        message: 'Usage record updated successfully'
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      };
      res.status(400).json(response);
    }
  }
}