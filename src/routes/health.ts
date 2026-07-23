import express from 'express';
import { Mongo } from '../database/mongo.js';

const healthRouter = express.Router();

healthRouter.get('/', (_req, res) => {
    try {
        Mongo.db.command({ ping: 1 });
        res.json({
            success: true,
            statusCode: 200,
            body: { status: 'healthy', uptime: process.uptime() }
        });
    } catch (_error) {
        res.status(503).json({
            success: false,
            statusCode: 503,
            body: { status: 'unhealthy' }
        });
    }
});

export default healthRouter;
