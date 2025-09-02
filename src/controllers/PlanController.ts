import { Request, Response } from 'express';
import { IPlanService } from '../interfaces/IPlanService';
import { CreatePlanDto, UpdatePlanDto } from '../dto/plan.dto';
import { ApiResponse } from '../types/common';

export class PlanController {
  constructor(private planService: IPlanService) {}

  async createPlan(req: Request, res: Response): Promise<void> {
    try {
      const planData: CreatePlanDto = req.body;
      const plan = await this.planService.createPlan(planData);
      
      const response: ApiResponse = {
        success: true,
        data: plan,
        message: 'Plan created successfully'
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

  async getPlanById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const plan = await this.planService.getPlanById(id);
      
      if (!plan) {
        const response: ApiResponse = {
          success: false,
          error: 'Plan not found'
        };
        res.status(404).json(response);
        return;
      }
      
      const response: ApiResponse = {
        success: true,
        data: plan
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

  async getPlansByOrganization(req: Request, res: Response): Promise<void> {
    try {
      const organizationId = req.params.organizationId;
      const plans = await this.planService.getPlansByOrganization(organizationId);
      
      const response: ApiResponse = {
        success: true,
        data: plans
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

  async updatePlan(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const planData: UpdatePlanDto = req.body;
      const plan = await this.planService.updatePlan(id, planData);
      
      if (!plan) {
        const response: ApiResponse = {
          success: false,
          error: 'Plan not found'
        };
        res.status(404).json(response);
        return;
      }
      
      const response: ApiResponse = {
        success: true,
        data: plan,
        message: 'Plan updated successfully'
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

  async deletePlan(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const deleted = await this.planService.deletePlan(id);
      
      if (!deleted) {
        const response: ApiResponse = {
          success: false,
          error: 'Plan not found'
        };
        res.status(404).json(response);
        return;
      }
      
      const response: ApiResponse = {
        success: true,
        message: 'Plan deleted successfully'
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