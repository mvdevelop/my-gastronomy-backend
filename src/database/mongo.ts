import { MongoClient, Db } from "mongodb";
import logger from '../utils/logger.js';

export class Mongo {
    private static _db: Db | null = null;

    static async connect({ mongoConnectionString, mongoDbName }: { mongoConnectionString: string, mongoDbName: string }): Promise<string> {
        try {
            const client = new MongoClient(mongoConnectionString);
            await client.connect();
            const db = client.db(mongoDbName);
            this._db = db;
            logger.info('Connected to MongoDB');
            return "Database connection established";
        } catch (error) {
            logger.error({ err: error }, 'MongoDB connection error');
            throw error;
        }
    }

    static get db(): Db {
        if (!this._db) {
            throw new Error("Database not connected. Call Mongo.connect() first.");
        }
        return this._db;
    }
}
