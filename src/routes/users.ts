import express from 'express';
import UsersControllers from '../controllers/users.js';

const usersRouter = express.Router();
const usersControllers = new UsersControllers();

usersRouter.get('/', async (req: express.Request, res: express.Response) => {
    try {
        const { success, statusCode, body } = await usersControllers.getUsers();
        res.status(statusCode).send({ success, statusCode, body });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, statusCode: 500, body: { message: 'Internal server error' } });
    }
});

usersRouter.delete('/:id', async (req: express.Request, res: express.Response) => {
    try {
        const { success, statusCode, body } = await usersControllers.deleteUser(req.params.id);
        res.status(statusCode).send({ success, statusCode, body });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, statusCode: 500, body: { message: 'Internal server error' } });
    }
});

usersRouter.put('/:id', async (req: express.Request, res: express.Response) => {
    try {
        const { success, statusCode, body } = await usersControllers.updateUser(req.params.id, req.body);
        res.status(statusCode).send({ success, statusCode, body });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, statusCode: 500, body: { message: 'Internal server error' } });
    }
});

export default usersRouter;
