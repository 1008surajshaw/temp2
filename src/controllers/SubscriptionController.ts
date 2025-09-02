import { Request, Response } from 'express';
import { ISubscriptionService } from '../interfaces/ISubscriptionService';
import { CreateSubscriptionDto, UpdateSubscriptionDto } from '../dto/subscription.dto';
import { ApiResponse } from '../types/common';

export class SubscriptionController {
  constructor(private subscriptionService: ISubscriptionService) {}

  async createSubscription(req: Request, res: Response): Promise<void> {
    try {
      const subscriptionData: CreateSubscriptionDto = req.body;
      const subscription = await this.subscriptionService.createSubscription(subscriptionData);
      
      const response: ApiResponse = {
        success: true,
        data: subscription,
        message: 'Subscription created successfully'
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

  async getSubscriptionById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const subscription = await this.subscriptionService.getSubscriptionById(id);
      
      if (!subscription) {
        const response: ApiResponse = {
          success: false,
          error: 'Subscription not found'
        };
        res.status(404).json(response);
        return;
      }
      
      const response: ApiResponse = {
        success: true,
        data: subscription
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

  async getSubscriptionsByUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      const subscriptions = await this.subscriptionService.getSubscriptionsByUser(userId);
      
      const response: ApiResponse = {
        success: true,
        data: subscriptions
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

  async getActiveSubscriptionsByUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      const subscriptions = await this.subscriptionService.getActiveSubscriptionsByUser(userId);
      
      const response: ApiResponse = {
        success: true,
        data: subscriptions
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

  async updateSubscription(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const subscriptionData: UpdateSubscriptionDto = req.body;
      const subscription = await this.subscriptionService.updateSubscription(id, subscriptionData);
      
      if (!subscription) {
        const response: ApiResponse = {
          success: false,
          error: 'Subscription not found'
        };
        res.status(404).json(response);
        return;
      }
      
      const response: ApiResponse = {
        success: true,
        data: subscription,
        message: 'Subscription updated successfully'
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

  async cancelSubscription(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const subscription = await this.subscriptionService.cancelSubscription(id);
      
      if (!subscription) {
        const response: ApiResponse = {
          success: false,
          error: 'Subscription not found'
        };
        res.status(404).json(response);
        return;
      }
      
      const response: ApiResponse = {
        success: true,
        data: subscription,
        message: 'Subscription cancelled successfully'
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