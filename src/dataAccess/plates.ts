import { Mongo } from "../database/mongo.js";
import { ObjectId } from "mongodb";

const collectionName = 'plates';

export default class PlatesDataAccess {
    async getPlate(): Promise<any> {
        const result = await Mongo.db
            .collection(collectionName)
            .find({ })
            .toArray()

        return result
    }

    async getAvailablePlates(): Promise<any> {
        const result = await Mongo.db
            .collection(collectionName)
            .find({ available: true })
            .toArray()

        return result
    }

    async addPlate(plateData: any): Promise<any> {
        const result = await Mongo.db
            .collection(collectionName)
            .insertOne(plateData)

        return result
    }

    async deletePlate(plateId: string): Promise<any> {
        const result = await Mongo.db
            .collection(collectionName)
            .findOneAndDelete({ _id: new ObjectId(plateId) });

        return result
    }

    async updatePlates(plateId: string, plateData: any): Promise<any> {
        const result = await Mongo.db
            .collection(collectionName)
            .findOneAndUpdate(
                { _id: new ObjectId(plateId) },
                { $set: plateData }
            );

        return result
    }

}
