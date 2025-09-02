import { Request, Response } from 'express';
import { IOrganizationService } from '../interfaces/IOrganizationService';
import { CreateOrganizationDto, UpdateOrganizationDto } from '../dto/organization.dto';
import { ApiResponse } from '../types/common';

export class OrganizationController {
  constructor(private organizationService: IOrganizationService) {}

  async createOrganization(req: Request, res: Response): Promise<void> {
    try {
      const data: CreateOrganizationDto = req.body;
      const organization = await this.organizationService.createOrganization(data);
      
      const response: ApiResponse = {
        success: true,
        data: organization,
        message: 'Organization created successfully'
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

  async updateOrganization(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const data: UpdateOrganizationDto = req.body;
      const organization = await this.organizationService.updateOrganization(id, data);
      
      if (!organization) {
        const response: ApiResponse = {
          success: false,
          error: 'Organization not found'
        };
        res.status(404).json(response);
        return;
      }
      
      const response: ApiResponse = {
        success: true,
        data: organization,
        message: 'Organization updated successfully'
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

  async getOrganizationById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const organization = await this.organizationService.getOrganizationById(id);
      
      if (!organization) {
        const response: ApiResponse = {
          success: false,
          error: 'Organization not found'
        };
        res.status(404).json(response);
        return;
      }
      
      const response: ApiResponse = {
        success: true,
        data: organization
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