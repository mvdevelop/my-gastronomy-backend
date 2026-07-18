import { MongoClient, Db } from "mongodb";

export class Mongo {
    private static db: Db;

    static async connect({ mongoConnectionString, mongoDbName }: { mongoConnectionString: string, mongoDbName: string }): Promise<string> {
        try {
            const client = new MongoClient(mongoConnectionString);
            await client.connect();
            const db = client.db(mongoDbName);
            this.db = db;
            console.log("Connected to MongoDB");
            return "Database connection established";
        } catch (error) {
            console.error("MongoDB connection error:", error);
            throw error;
        }
    }

    static get db(): Db {
        if (!this.db) {
            throw new Error("Database not connected. Call Mongo.connect() first.");
        }
        return this.db;
    }

    static set db(value: Db) {
        this.db = value;
    }
}