import express from 'express';
import PlatesControllers from '../controllers/plates.js';

const platesRouter = express.Router();
const platesControllers = new PlatesControllers();

platesRouter.get('/', async (req: express.Request, res: express.Response) => {
    try {
        const { success, statusCode, body } = await platesControllers.getPlates();
        res.status(statusCode).send({ success, statusCode, body });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, statusCode: 500, body: { message: 'Internal server error' } });
    }
});

platesRouter.get('/availables/', async (req: express.Request, res: express.Response) => {
    try {
        const { success, statusCode, body } = await platesControllers.getAvailablePlates();
        res.status(statusCode).send({ success, statusCode, body });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, statusCode: 500, body: { message: 'Internal server error' } });
    }
});

platesRouter.post('/', async (req: express.Request, res: express.Response) => {
    try {
        const { success, statusCode, body } = await platesControllers.addPlate(req.body);
        res.status(statusCode).send({ success, statusCode, body });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, statusCode: 500, body: { message: 'Internal server error' } });
    }
});

platesRouter.delete('/:id', async (req: express.Request, res: express.Response) => {
    try {
        const { success, statusCode, body } = await platesControllers.deletePlate(req.params.id);
        res.status(statusCode).send({ success, statusCode, body });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, statusCode: 500, body: { message: 'Internal server error' } });
    }
});

platesRouter.put('/:id', async (req: express.Request, res: express.Response) => {
    try {
        const { success, statusCode, body } = await platesControllers.updatePlate(req.params.id, req.body);
        res.status(statusCode).send({ success, statusCode, body });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, statusCode: 500, body: { message: 'Internal server error' } });
    }
});

export default platesRouter;
