import express from 'express';
import OrdersControllers from '../controllers/orders.js';
import { createOrderValidation, updateOrderValidation } from '../validation/ordersValidation.js';

const ordersRouter = express.Router();
const ordersControllers = new OrdersControllers();

ordersRouter.get('/', async (_req: express.Request, res: express.Response) => {
    try {
        const { success, statusCode, body } = await ordersControllers.getOrders();
        res.status(statusCode).send({ success, statusCode, body });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, statusCode: 500, body: { message: 'Internal server error' } });
    }
});

ordersRouter.get('/userorders/:id', async (req: express.Request, res: express.Response) => {
    try {
        const { success, statusCode, body } = await ordersControllers.getOrdersByUserId(req.params.id);
        res.status(statusCode).send({ success, statusCode, body });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, statusCode: 500, body: { message: 'Internal server error' } });
    }
});

ordersRouter.post('/', createOrderValidation, async (req: express.Request, res: express.Response) => {
    try {
        const { success, statusCode, body } = await ordersControllers.addOrder(req.body);
        res.status(statusCode).send({ success, statusCode, body });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, statusCode: 500, body: { message: 'Internal server error' } });
    }
});

ordersRouter.delete('/:id', async (req: express.Request, res: express.Response) => {
    try {
        const { success, statusCode, body } = await ordersControllers.deleteOrder(req.params.id);
        res.status(statusCode).send({ success, statusCode, body });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, statusCode: 500, body: { message: 'Internal server error' } });
    }
});

ordersRouter.put('/:id', updateOrderValidation, async (req: express.Request, res: express.Response) => {
    try {
        const { success, statusCode, body } = await ordersControllers.updateOrder(req.params.id, req.body);
        res.status(statusCode).send({ success, statusCode, body });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, statusCode: 500, body: { message: 'Internal server error' } });
    }
});

export default ordersRouter;
