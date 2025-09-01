import { Request, Response } from 'express';
import { IFeatureService } from '../interfaces/IFeatureService';
import { CreateFeatureDto, UpdateFeatureDto } from '../dto/feature.dto';
import { ApiResponse } from '../types/common';

export class FeatureController {
  constructor(private featureService: IFeatureService) {}

  async createFeature(req: Request, res: Response): Promise<void> {
    try {
      const data: CreateFeatureDto = req.body;
      const feature = await this.featureService.createFeature(data);
      
      const response: ApiResponse = {
        success: true,
        data: feature,
        message: 'Feature created successfully'
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

  async updateFeature(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const data: UpdateFeatureDto = req.body;
      const feature = await this.featureService.updateFeature(id, data);
      
      if (!feature) {
        const response: ApiResponse = {
          success: false,
          error: 'Feature not found'
        };
        res.status(404).json(response);
        return;
      }
      
      const response: ApiResponse = {
        success: true,
        data: feature,
        message: 'Feature updated successfully'
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

  async deleteFeature(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const deleted = await this.featureService.deleteFeature(id);
      
      if (!deleted) {
        const response: ApiResponse = {
          success: false,
          error: 'Feature not found'
        };
        res.status(404).json(response);
        return;
      }
      
      const response: ApiResponse = {
        success: true,
        message: 'Feature deleted successfully'
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

  async getFeatureById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const feature = await this.featureService.getFeatureById(id);
      
      if (!feature) {
        const response: ApiResponse = {
          success: false,
          error: 'Feature not found'
        };
        res.status(404).json(response);
        return;
      }
      
      const response: ApiResponse = {
        success: true,
        data: feature
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

  async getFeaturesByOrganization(req: Request, res: Response): Promise<void> {
    try {
      const organizationId = parseInt(req.params.organizationId);
      const features = await this.featureService.getFeaturesByOrganization(organizationId);
      
      const response: ApiResponse = {
        success: true,
        data: features
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

  async toggleFeatureStatus(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const feature = await this.featureService.toggleFeatureStatus(id);
      
      if (!feature) {
        const response: ApiResponse = {
          success: false,
          error: 'Feature not found'
        };
        res.status(404).json(response);
        return;
      }
      
      const response: ApiResponse = {
        success: true,
        data: feature,
        message: `Feature ${feature.is_active ? 'activated' : 'deactivated'} successfully`
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