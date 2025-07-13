import { Role } from '../entities/user.entity';
import { Request, Response } from 'express';

export interface CustomContext {
  req: Request & { session: any };
  res: Response;
}




declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: Role;
        email: string;
      };
    }
  }
}