import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { SafeUser } from '../types/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';

export interface AuthRequest extends Request {
    user?: SafeUser;
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
            success: false,
            statusCode: 401,
            body: { message: 'Authentication required' }
        });
        return;
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as SafeUser;
        (req as AuthRequest).user = decoded;
        next();
    } catch (_error) {
        res.status(401).json({
            success: false,
            statusCode: 401,
            body: { message: 'Invalid or expired token' }
        });
    }
}
