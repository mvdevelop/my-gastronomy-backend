import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction): void {
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.path}:`, err.message);

    if (err instanceof SyntaxError && 'body' in err) {
        res.status(400).json({
            success: false,
            statusCode: 400,
            body: { message: 'Invalid JSON in request body' }
        });
        return;
    }

    if (err.message.includes('Argument passed in must be a single String of 12 bytes')) {
        res.status(400).json({
            success: false,
            statusCode: 400,
            body: { message: 'Invalid ID format' }
        });
        return;
    }

    res.status(500).json({
        success: false,
        statusCode: 500,
        body: { message: 'Internal server error' }
    });
}
