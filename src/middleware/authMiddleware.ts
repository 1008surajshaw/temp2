import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiResponse } from '../types/common';

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    organization_id: number;
    user_type: 'admin' | 'user';
  };
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const response: ApiResponse = {
        success: false,
        error: 'Access token required'
      };
      res.status(401).json(response);
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    
    const decoded = jwt.verify(token, secret) as any;
    req.user = decoded;
    
    next();
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Invalid or expired token'
    };
    res.status(401).json(response);
  }
};

export const adminMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.user_type !== 'admin') {
    const response: ApiResponse = {
      success: false,
      error: 'Admin access required'
    };
    res.status(403).json(response);
    return;
  }
  next();
};

export { AuthenticatedRequest };