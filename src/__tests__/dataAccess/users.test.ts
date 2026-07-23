import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Mongo } from '../../database/mongo.js';
import UsersDataAccess from '../../dataAccess/users.js';
import crypto from 'crypto';

let mongod: MongoMemoryServer;
const usersDA = new UsersDataAccess();

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
    await Mongo.db.collection('users').deleteMany({});
});

describe('UsersDataAccess', () => {
    it('should return empty array initially', async () => {
        const users = await usersDA.getUsers();
        expect(users).toEqual([]);
    });

    it('should insert and retrieve a user', async () => {
        const salt = crypto.randomBytes(16);
        const hashedPassword = crypto.pbkdf2Sync('password', salt, 310000, 16, 'sha256');

        await Mongo.db.collection('users').insertOne({
            fullname: 'John Doe',
            email: 'john@test.com',
            password: hashedPassword,
            salt,
        });

        const users = await usersDA.getUsers();
        expect(users).toHaveLength(1);
        expect(users[0].fullname).toBe('John Doe');
        expect(users[0].email).toBe('john@test.com');
    });

    it('should delete a user', async () => {
        const salt = crypto.randomBytes(16);
        const hashedPassword = crypto.pbkdf2Sync('password', salt, 310000, 16, 'sha256');

        const result = await Mongo.db.collection('users').insertOne({
            fullname: 'Jane Doe',
            email: 'jane@test.com',
            password: hashedPassword,
            salt,
        });

        const deleteResult = await usersDA.deleteUser(result.insertedId.toString());
        expect(deleteResult.deletedCount).toBe(1);

        const users = await usersDA.getUsers();
        expect(users).toHaveLength(0);
    });

    it('should update a user without password', async () => {
        const salt = crypto.randomBytes(16);
        const hashedPassword = crypto.pbkdf2Sync('password', salt, 310000, 16, 'sha256');

        const result = await Mongo.db.collection('users').insertOne({
            fullname: 'Old Name',
            email: 'update@test.com',
            password: hashedPassword,
            salt,
        });

        const updateResult = await usersDA.updateUser(result.insertedId.toString(), {
            fullname: 'New Name',
        });

        expect(updateResult.modifiedCount).toBe(1);

        const user = await Mongo.db.collection('users').findOne({ _id: result.insertedId });
        expect(user?.fullname).toBe('New Name');
    });

    it('should update a user with password and hash it', async () => {
        const salt = crypto.randomBytes(16);
        const hashedPassword = crypto.pbkdf2Sync('oldpassword', salt, 310000, 16, 'sha256');

        const result = await Mongo.db.collection('users').insertOne({
            fullname: 'Password User',
            email: 'password@test.com',
            password: hashedPassword,
            salt,
        });

        const updateResult = await usersDA.updateUser(result.insertedId.toString(), {
            password: 'newpassword',
        });

        expect(updateResult.modifiedCount).toBe(1);

        const user = await Mongo.db.collection('users').findOne({ _id: result.insertedId });
        expect(user).toBeDefined();
        // Password should be different from the old one
        const newPassword = Buffer.from(user!.password.buffer);
        expect(newPassword.equals(hashedPassword)).toBe(false);
    });
});
