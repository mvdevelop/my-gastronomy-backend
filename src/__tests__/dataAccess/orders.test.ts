import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ObjectId } from 'mongodb';
import { Mongo } from '../../database/mongo.js';
import OrdersDataAccess from '../../dataAccess/orders.js';

let mongod: MongoMemoryServer;
const ordersDA = new OrdersDataAccess();

beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    await Mongo.connect({
        mongoConnectionString: mongod.getUri(),
        mongoDbName: 'test'
    });
});

afterAll(async () => {
    if (mongod) await mongod.stop();
});

afterEach(async () => {
    await Mongo.db.collection('orders').deleteMany({});
    await Mongo.db.collection('orderItems').deleteMany({});
    await Mongo.db.collection('users').deleteMany({});
    await Mongo.db.collection('plates').deleteMany({});
});

async function createTestUser() {
    const result = await Mongo.db.collection('users').insertOne({
        fullname: 'Test User',
        email: 'test@test.com',
        password: Buffer.from('password'),
        salt: Buffer.from('salt'),
    });
    return result.insertedId;
}

async function createTestPlate() {
    const result = await Mongo.db.collection('plates').insertOne({
        name: 'Test Plate',
        price: 25,
        available: true,
        description: 'A test plate',
        ingredients: ['ingredient1'],
        imgUrl: 'http://example.com/plate.jpg',
        category: 'Main',
    });
    return result.insertedId;
}

describe('OrdersDataAccess', () => {
    it('should return empty array initially', async () => {
        const orders = await ordersDA.getAllOrders();
        expect(orders).toEqual([]);
    });

    it('should create an order with items', async () => {
        const userId = await createTestUser();
        const plateId = await createTestPlate();

        const result = await ordersDA.addOrder({
            userId: userId.toString(),
            items: [{ plateId: plateId.toString(), quantity: 2 }],
        });

        expect(result.insertedId).toBeDefined();
    });

    it('should get all orders with populated data', async () => {
        const userId = await createTestUser();
        const plateId = await createTestPlate();

        await ordersDA.addOrder({
            userId: userId.toString(),
            items: [{ plateId: plateId.toString(), quantity: 1 }],
        });

        const orders = await ordersDA.getAllOrders();
        expect(orders).toHaveLength(1);
        expect(orders[0].userDetails).toBeDefined();
        expect(orders[0].orderItems).toBeDefined();
    });

    it('should get orders by user id', async () => {
        const userId = await createTestUser();
        const plateId = await createTestPlate();

        await ordersDA.addOrder({
            userId: userId.toString(),
            items: [{ plateId: plateId.toString(), quantity: 1 }],
        });

        const orders = await ordersDA.getOrdersByUserId(userId.toString());
        expect(orders).toHaveLength(1);
    });

    it('should delete an order and its items', async () => {
        const userId = await createTestUser();
        const plateId = await createTestPlate();

        const orderResult = await ordersDA.addOrder({
            userId: userId.toString(),
            items: [{ plateId: plateId.toString(), quantity: 1 }],
        });

        const result = await ordersDA.deleteOrder(orderResult.insertedId.toString());
        expect(result.orderDeleted.deletedCount).toBe(1);

        const orders = await ordersDA.getAllOrders();
        expect(orders).toHaveLength(0);
    });

    it('should update an order', async () => {
        const userId = await createTestUser();
        const plateId = await createTestPlate();

        const orderResult = await ordersDA.addOrder({
            userId: userId.toString(),
            items: [{ plateId: plateId.toString(), quantity: 1 }],
        });

        const updateResult = await ordersDA.updateOrder(orderResult.insertedId.toString(), {
            pickupStatus: 'Ready',
        });

        expect(updateResult.modifiedCount).toBe(1);
    });
});
