import { ObjectId } from 'mongodb';

// --- User ---
export interface IUser {
    _id?: ObjectId;
    fullname: string;
    email: string;
    password: Buffer;
    salt: Buffer;
    createdAt?: Date;
}

export interface CreateUserDTO {
    fullname: string;
    email: string;
    password: string;
}

export interface UpdateUserDTO {
    fullname?: string;
    email?: string;
    password?: string;
}

export interface SafeUser {
    _id: ObjectId;
    fullname: string;
    email: string;
}

// --- Plate ---
export interface IPlate {
    _id?: ObjectId;
    name: string;
    price: number;
    available: boolean;
    description: string;
    ingredients: string[];
    imgUrl: string;
    category: string;
}

export interface CreatePlateDTO {
    name: string;
    price: number;
    available: boolean;
    description: string;
    ingredients: string[];
    imgUrl: string;
    category: string;
}

export interface UpdatePlateDTO {
    name?: string;
    price?: number;
    available?: boolean;
    description?: string;
    ingredients?: string[];
    imgUrl?: string;
    category?: string;
}

// --- Order ---
export interface IOrder {
    _id?: ObjectId;
    userId: ObjectId;
    pickupStatus: string;
    pickupTime?: Date;
    createdAt: Date;
}

export interface IOrderItem {
    _id?: ObjectId;
    orderId: ObjectId;
    plateId: ObjectId;
    quantity?: number;
}

export interface CreateOrderDTO {
    userId: string;
    items: { plateId: string; quantity?: number }[];
    pickupTime?: Date;
}

export interface UpdateOrderDTO {
    pickupStatus?: string;
    pickupTime?: Date;
}

export interface PopulatedOrder {
    _id: ObjectId;
    userDetails: SafeUser;
    orderItems: Array<IOrderItem & { itemDetails?: IPlate[] }>;
    pickupStatus: string;
    pickupTime?: Date;
}
