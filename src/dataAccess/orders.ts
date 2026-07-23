import { Mongo } from "../database/mongo.js";
import { ObjectId, InsertOneResult, DeleteResult, UpdateResult } from "mongodb";
import { IOrder, IOrderItem, CreateOrderDTO, UpdateOrderDTO, PopulatedOrder } from '../types/index.js';

const collectionName = 'orders';

export default class OrdersDataAccess {
    private async aggregateOrders(matchStage?: object): Promise<PopulatedOrder[]> {
        const pipeline: object[] = [];

        if (matchStage) {
            pipeline.push(matchStage);
        }

        pipeline.push(
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
        );

        return Mongo.db
            .collection<IOrder>(collectionName)
            .aggregate<PopulatedOrder>(pipeline)
            .toArray();
    }

    async getAllOrders(): Promise<PopulatedOrder[]> {
        return this.aggregateOrders();
    }

    async getOrdersByUserId(userId: string): Promise<PopulatedOrder[]> {
        return this.aggregateOrders({ $match: { userId: new ObjectId(userId) } });
    }

    async addOrder(orderData: CreateOrderDTO): Promise<InsertOneResult<IOrder>> {
        const { items, ...orderDataRest } = orderData;

        const orderDocument = {
            ...orderDataRest,
            createdAt: new Date(),
            pickupStatus: 'Pending',
            userId: new ObjectId(orderDataRest.userId),
        };

        const newOrder = await Mongo.db
            .collection<IOrder>(collectionName)
            .insertOne(orderDocument);

        if(!newOrder.insertedId) {
            throw new Error('Order cannot be inserted.');
        }

        const orderItems: Omit<IOrderItem, '_id'>[] = items.map((item) => ({
            plateId: new ObjectId(item.plateId),
            orderId: new ObjectId(newOrder.insertedId),
            quantity: item.quantity,
        }));

        await Mongo.db
            .collection<IOrderItem>('orderItems')
            .insertMany(orderItems);

        return newOrder;
    }

    async deleteOrder(orderId: string): Promise<{ itemsDeleted: DeleteResult; orderDeleted: DeleteResult }> {
        const itemsDeleted = await Mongo.db
            .collection<IOrderItem>('orderItems')
            .deleteMany({ orderId: new ObjectId(orderId) });

        const orderDeleted = await Mongo.db
            .collection<IOrder>(collectionName)
            .deleteOne({ _id: new ObjectId(orderId) });

        return { itemsDeleted, orderDeleted };
    }

    async updateOrder(orderId: string, orderData: UpdateOrderDTO): Promise<UpdateResult> {
        const result = await Mongo.db
            .collection<IOrder>(collectionName)
            .updateOne(
                { _id: new ObjectId(orderId) },
                { $set: orderData }
            );

        return result
    }

}
