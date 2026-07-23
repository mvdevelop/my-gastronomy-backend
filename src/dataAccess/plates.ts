import { Mongo } from "../database/mongo.js";
import { ObjectId, InsertOneResult, DeleteResult, UpdateResult } from "mongodb";
import { IPlate, CreatePlateDTO, UpdatePlateDTO } from '../types/index.js';

const collectionName = 'plates';

export default class PlatesDataAccess {
    async getAllPlates(): Promise<IPlate[]> {
        const result = await Mongo.db
            .collection<IPlate>(collectionName)
            .find({ })
            .toArray()

        return result
    }

    async getAvailablePlates(): Promise<IPlate[]> {
        const result = await Mongo.db
            .collection<IPlate>(collectionName)
            .find({ available: true })
            .toArray()

        return result
    }

    async addPlate(plateData: CreatePlateDTO): Promise<InsertOneResult<IPlate>> {
        const result = await Mongo.db
            .collection<IPlate>(collectionName)
            .insertOne(plateData)

        return result
    }

    async deletePlate(plateId: string): Promise<DeleteResult> {
        const result = await Mongo.db
            .collection<IPlate>(collectionName)
            .deleteOne({ _id: new ObjectId(plateId) });

        return result
    }

    async updatePlate(plateId: string, plateData: UpdatePlateDTO): Promise<UpdateResult> {
        const result = await Mongo.db
            .collection<IPlate>(collectionName)
            .updateOne(
                { _id: new ObjectId(plateId) },
                { $set: plateData }
            );

        return result
    }

}
