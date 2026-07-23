import UsersDataAccess from '../dataAccess/users.js';
import { ok, serverError, HttpResponse } from '../helpers/httpResponse.js';
import { IUser, UpdateUserDTO } from '../types/index.js';

export default class UsersControllers {
    private dataAccess: UsersDataAccess;

    constructor() {
        this.dataAccess = new UsersDataAccess();
    }

    async getUsers(): Promise<HttpResponse<IUser[]>> {
        try {
            const users = await this.dataAccess.getUsers();
            return ok(users);
        } catch (error) {
            return serverError(error);
        }
    }

    async deleteUser(userId: string) {
        try {
            const result = await this.dataAccess.deleteUser(userId);
            return ok(result);
        } catch (error) {
            return serverError(error);
        }
    }

    async updateUser(userId: string, userData: UpdateUserDTO) {
        try {
            const result = await this.dataAccess.updateUser(userId, userData);
            return ok(result);
        } catch (error) {
            return serverError(error);
        }
    }

}
