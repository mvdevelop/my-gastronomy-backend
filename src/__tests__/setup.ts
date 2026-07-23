import { MongoMemoryServer } from 'mongodb-memory-server';
import { Mongo } from '../database/mongo.js';

let mongod: MongoMemoryServer;

beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await Mongo.connect({
        mongoConnectionString: uri,
        mongoDbName: 'test'
    });
});

afterAll(async () => {
    if (mongod) {
        await mongod.stop();
    }
});

afterEach(async () => {
    const db = Mongo.db;
    const collections = await db.listCollections().toArray();
    for (const collection of collections) {
        await db.collection(collection.name).deleteMany({});
    }
});
