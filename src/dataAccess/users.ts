import { Mongo } from "../database/mongo.js";
import { ObjectId, DeleteResult, UpdateResult } from "mongodb";
import crypto from 'crypto';
import { promisify } from 'util';
import { IUser, UpdateUserDTO } from '../types/index.js';

const pbkdf2Async = promisify(crypto.pbkdf2);

const collectionName = 'users';

export default class UsersDataAccess {
    async getUsers(): Promise<IUser[]> {
        const result = await Mongo.db
            .collection<IUser>(collectionName)
            .find({ })
            .toArray()

        return result
    }

    async deleteUser(userId: string): Promise<DeleteResult> {
        const result = await Mongo.db
            .collection<IUser>(collectionName)
            .deleteOne({ _id: new ObjectId(userId) });

        return result
    }

    async updateUser(userId: string, userData: UpdateUserDTO): Promise<UpdateResult> {
        const updateData: Record<string, unknown> = { ...userData };

        if(userData.password) {
            const salt = crypto.randomBytes(16);
            const hashedPassword = await pbkdf2Async(userData.password, salt, 310000, 16, 'sha256');

            updateData.password = hashedPassword;
            updateData.salt = salt;
        }

        const result = await Mongo.db
            .collection<IUser>(collectionName)
            .updateOne(
                { _id: new ObjectId(userId) },
                { $set: updateData }
            );

        return result;
    }
}
