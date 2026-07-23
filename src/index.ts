import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Mongo } from './database/mongo.js';
import { config } from 'dotenv';
import authRouter from './auth/auth.js';
import usersRouter from './routes/users.js';
import platesRouter from './routes/plates.js';
import ordersRouter from './routes/orders.js';
import healthRouter from './routes/health.js';
import { authenticate } from './middleware/authenticate.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import logger from './utils/logger.js';

config();

async function main () {
    const port = parseInt(process.env.PORT || '3000', 10);

    const app = express();

    // Security headers
    app.use(helmet());

    // CORS configuration
    const corsOptions = {
        origin: process.env.CORS_ORIGIN || '*',
        credentials: process.env.CORS_CREDENTIALS === 'true',
    };
    app.use(cors(corsOptions));

    // Rate limiting
    const limiter = rateLimit({
        windowMs: 60 * 1000,
        max: parseInt(process.env.RATE_LIMIT || '100', 10),
        standardHeaders: true,
        legacyHeaders: false,
    });
    app.use(limiter);

    // Body parsing
    app.use(express.json({ limit: process.env.BODY_LIMIT || '1mb' }));

    // Request logging
    app.use(requestLogger);

    // Database connection
    const mongoConnection = await Mongo.connect({
        mongoConnectionString: process.env.MONGO_CS!,
        mongoDbName: process.env.MONGO_DB_NAME!
    });
    logger.info(mongoConnection);

    // API v1 routes
    app.use('/api/v1/health', healthRouter);
    app.use('/api/v1/auth', authRouter);
    app.use('/api/v1/users', authenticate, usersRouter);
    app.use('/api/v1/plates', authenticate, platesRouter);
    app.use('/api/v1/orders', authenticate, ordersRouter);

    // Global error handler (must be last)
    app.use(errorHandler);

    const server = app.listen(port, () => {
        logger.info(`Server running on: http://localhost:${port}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
        logger.info('SIGTERM received, shutting down gracefully');
        server.close(() => {
            logger.info('Server closed');
            process.exit(0);
        });
    });
}

main();
