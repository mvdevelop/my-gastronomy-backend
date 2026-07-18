import { Mongo } from "../database/mongo.js";
import { ObjectId } from "mongodb";

const collectionName = 'orders';

export default class OrdersDataAccess {
    async getOrder(): Promise<any> {
        const result = await Mongo.db
            .collection(collectionName)
            .aggregate([
                {
                    $lookup: {
                        from: 'orderItems',
                        localField: '_id',
                        foreignField: 'orderId',
                        as: 'orderItems'
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'userDetails'
                    }
                },
                {
                    $project: {
                        'userDetails.password': 0,
                        'userDetails.salt': 0,
                    }
                },
                {
                    $unwind: '$orderItems'
                },
                {
                    $lookup: {
                        from: 'plates',
                        localField: 'orderItems.plateId',
                        foreignField: '_id',
                        as: 'orderItems.itemDetails'
                    }
                },
                {
                    $group: {
                        _id: '$_id',
                        userDetails: { $first: '$userDetails' },
                        orderItems: { $push: '$orderItems' },
                        pickupStatus: { $first: '$pickupStatus' },
                        pickupTime: { $first: '$pickupTime' }
                    }
                }
            ])
            .toArray()

        return result
    }

    // Cópia getOrder
    async getOrderByUserId(userId: string): Promise<any> {
        const result = await Mongo.db
            .collection(collectionName)
            .aggregate([
                // Mudanças
                {
                    $match: { userId: new ObjectId(userId) }
                },
                {
                    $lookup: {
                        from: 'orderItems',
                        localField: '_id',
                        foreignField: 'orderId',
                        as: 'orderItems'
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'userDetails'
                    }
                },
                {
                    $project: {
                        'userDetails.password': 0,
                        'userDetails.salt': 0,
                    }
                },
                {
                    $unwind: '$orderItems'
                },
                {
                    $lookup: {
                        from: 'plates',
                        localField: 'orderItems.plateId',
                        foreignField: '_id',
                        as: 'orderItems.itemDetails'
                    }
                },
                {
                    $group: {
                        _id: '$_id',
                        userDetails: { $first: '$userDetails' },
                        orderItems: { $push: '$orderItems' },
                        pickupStatus: { $first: '$pickupStatus' },
                        pickupTime: { $first: '$pickupTime' }
                    }
                }
            ])
            .toArray()

        return result
    }

    async addOrder(orderData: any): Promise<any> {
        const { items, ...orderDataRest } = orderData;

        orderDataRest.createdAt = new Date();
        orderDataRest.pickupStatus = 'Pending';
        orderDataRest.userId = new ObjectId(orderDataRest.userId);

        const newOrder = await Mongo.db
            .collection(collectionName)
            .insertOne(orderDataRest)

        if(!newOrder.insertedId) {
            throw new Error('Order cannot be inserted.');
        }

        items.map((item: any) => {
            item.plateId = new ObjectId(item.plateId);
            item.orderId = new ObjectId(newOrder.insertedId);
        });

        const result = await Mongo.db
            .collection('orderItems')
            .insertMany(items)

        return result
    }

    async deleteOrder(orderId: string): Promise<any> {

        const itemsToDelete = await Mongo.db
            .collection('orderItems')
            .deleteMany({ orderId: new ObjectId(orderId) });

        const orderToDelete = await Mongo.db
            .collection(collectionName)
            .findOneAndDelete({ _id: new ObjectId(orderId) });

        const result = {
            itemsToDelete,
            orderToDelete
        }

        return result
    }

    async updateOrder(orderId: string, orderData: any): Promise<any> {
        const result = await Mongo.db
            .collection(collectionName)
            .findOneAndUpdate(
                { _id: new ObjectId(orderId) },
                { $set: orderData }
            );

        return result
    }

}