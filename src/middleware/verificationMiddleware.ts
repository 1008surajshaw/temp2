import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authMiddleware';
import { User } from '../models/User';
import { ApiResponse } from '../types/common';

export const verificationMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      const response: ApiResponse = {
        success: false,
        error: 'Authentication required'
      };
      res.status(401).json(response);
      return;
    }

    const user = await User.findById(req.user.id);
    
    if (!user || !user.is_verified) {
      const response: ApiResponse = {
        success: false,
        error: 'Email verification required'
      };
      res.status(403).json(response);
      return;
    }

    next();
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Verification check failed'
    };
    res.status(500).json(response);
  }
};