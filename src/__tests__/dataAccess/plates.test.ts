import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Mongo } from '../../database/mongo.js';
import PlatesDataAccess from '../../dataAccess/plates.js';

let mongod: MongoMemoryServer;
const platesDA = new PlatesDataAccess();

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
    await Mongo.db.collection('plates').deleteMany({});
});

describe('PlatesDataAccess', () => {
    it('should return empty array initially', async () => {
        const plates = await platesDA.getAllPlates();
        expect(plates).toEqual([]);
    });

    it('should add a plate', async () => {
        const result = await platesDA.addPlate({
            name: 'Pizza Margherita',
            price: 35.9,
            available: true,
            description: 'Classic pizza',
            ingredients: ['dough', 'tomato', 'mozzarella'],
            imgUrl: 'http://example.com/pizza.jpg',
            category: 'Pizza',
        });

        expect(result.insertedId).toBeDefined();

        const plates = await platesDA.getAllPlates();
        expect(plates).toHaveLength(1);
        expect(plates[0].name).toBe('Pizza Margherita');
    });

    it('should get only available plates', async () => {
        await platesDA.addPlate({
            name: 'Available Plate',
            price: 20,
            available: true,
            description: 'Available',
            ingredients: ['ingredient1'],
            imgUrl: 'http://example.com/1.jpg',
            category: 'Main',
        });

        await platesDA.addPlate({
            name: 'Unavailable Plate',
            price: 25,
            available: false,
            description: 'Unavailable',
            ingredients: ['ingredient2'],
            imgUrl: 'http://example.com/2.jpg',
            category: 'Main',
        });

        const available = await platesDA.getAvailablePlates();
        expect(available).toHaveLength(1);
        expect(available[0].name).toBe('Available Plate');
    });

    it('should delete a plate', async () => {
        const result = await platesDA.addPlate({
            name: 'To Delete',
            price: 10,
            available: true,
            description: 'Delete me',
            ingredients: [],
            imgUrl: '',
            category: 'Test',
        });

        const deleteResult = await platesDA.deletePlate(result.insertedId.toString());
        expect(deleteResult.deletedCount).toBe(1);

        const plates = await platesDA.getAllPlates();
        expect(plates).toHaveLength(0);
    });

    it('should update a plate', async () => {
        const result = await platesDA.addPlate({
            name: 'Old Name',
            price: 10,
            available: true,
            description: 'Test',
            ingredients: [],
            imgUrl: '',
            category: 'Test',
        });

        const updateResult = await platesDA.updatePlate(result.insertedId.toString(), {
            name: 'New Name',
            price: 15,
        });

        expect(updateResult.modifiedCount).toBe(1);

        const plates = await platesDA.getAllPlates();
        expect(plates[0].name).toBe('New Name');
        expect(plates[0].price).toBe(15);
    });
});
