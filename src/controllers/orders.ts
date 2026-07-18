import OrdersDataAccess from '../dataAccess/orders.js';
import { ok, serverError } from '../helpers/httpResponse.js';

export default class OrdersControllers {
    constructor() {
        this.dataAccess = new OrdersDataAccess();
    }

    async getOrders() {
        try {
            const orders = await this.dataAccess.getOrder();
            return ok(orders);
        } catch (error) {
            return serverError(error);
        }
    }

    // Cópia de getOrders
    async getOrdersByUserId(userId: string) {
        try {
            const orders = await this.dataAccess.getOrderByUserId(userId);
            return ok(orders);
        } catch (error) {
            return serverError(error);
        }
    }

    // Nova função
    async addOrder(orderData: any) {
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

    async updateOrder(orderId: string, orderData: any) {
        try {
            const result = await this.dataAccess.updateOrders(orderId, orderData);
            return ok(result);
        } catch (error) {
            return serverError(error);
        }
    }

}