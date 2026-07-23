import OrdersDataAccess from '../dataAccess/orders.js';
import { ok, serverError } from '../helpers/httpResponse.js';
import { CreateOrderDTO, UpdateOrderDTO } from '../types/index.js';

export default class OrdersControllers {
    private dataAccess: OrdersDataAccess;

    constructor() {
        this.dataAccess = new OrdersDataAccess();
    }

    async getOrders() {
        try {
            const orders = await this.dataAccess.getAllOrders();
            return ok(orders);
        } catch (error) {
            return serverError(error);
        }
    }

    async getOrdersByUserId(userId: string) {
        try {
            const orders = await this.dataAccess.getOrdersByUserId(userId);
            return ok(orders);
        } catch (error) {
            return serverError(error);
        }
    }

    async addOrder(orderData: CreateOrderDTO) {
        try {
            const result = await this.dataAccess.addOrder(orderData);
            return ok(result);
        } catch (error) {
            return serverError(error);
        }
    }

    async deleteOrder(orderId: string) {
        try {
            const result = await this.dataAccess.deleteOrder(orderId);
            return ok(result);
        } catch (error) {
            return serverError(error);
        }
    }

    async updateOrder(orderId: string, orderData: UpdateOrderDTO) {
        try {
            const result = await this.dataAccess.updateOrder(orderId, orderData);
            return ok(result);
        } catch (error) {
            return serverError(error);
        }
    }

}
