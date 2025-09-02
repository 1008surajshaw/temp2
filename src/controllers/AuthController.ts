import { Request, Response } from 'express';
import { IAuthService } from '../interfaces/IAuthService';
import { LoginDto } from '../dto/auth.dto';
import { ResendVerificationDto } from '../dto/user.dto';
import { ApiResponse } from '../types/common';

export class AuthController {
  constructor(private authService: IAuthService) {}

  async login(req: Request, res: Response): Promise<void> {
    try {
      const credentials: LoginDto = req.body;
      
      if (!credentials.email || !credentials.password) {
        const response: ApiResponse = {
          success: false,
          error: 'Email and password are required'
        };
        res.status(400).json(response);
        return;
      }

      const result = await this.authService.login(credentials);
      
      const response: ApiResponse = {
        success: true,
        data: result,
        message: result.message
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed'
      };
      res.status(401).json(response);
    }
  }

  async verifyEmail(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.params;
      const success = await this.authService.verifyEmail(token);
      
      if (!success) {
        const response: ApiResponse = {
          success: false,
          error: 'Invalid or expired verification token'
        };
        res.status(400).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: 'Email verified successfully'
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: 'Email verification failed'
      };
      res.status(500).json(response);
    }
  }

  async resendVerificationEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email }: ResendVerificationDto = req.body;
      
      if (!email) {
        const response: ApiResponse = {
          success: false,
          error: 'Email is required'
        };
        res.status(400).json(response);
        return;
      }

      const success = await this.authService.resendVerificationEmail(email);
      
      if (!success) {
        const response: ApiResponse = {
          success: false,
          error: 'User not found or already verified'
        };
        res.status(400).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: 'Verification email sent successfully'
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: 'Failed to send verification email'
      };
      res.status(500).json(response);
    }
  }
}