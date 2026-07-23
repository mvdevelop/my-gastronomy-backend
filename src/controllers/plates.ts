import PlatesDataAccess from '../dataAccess/plates.js';
import { ok, serverError } from '../helpers/httpResponse.js';
import { CreatePlateDTO, UpdatePlateDTO } from '../types/index.js';

export default class PlatesControllers {
    private dataAccess: PlatesDataAccess;

    constructor() {
        this.dataAccess = new PlatesDataAccess();
    }

    async getPlates() {
        try {
            const plates = await this.dataAccess.getAllPlates();
            return ok(plates);
        } catch (error) {
            return serverError(error);
        }
    }

    async getAvailablePlates() {
        try {
            const plates = await this.dataAccess.getAvailablePlates();
            return ok(plates);
        } catch (error) {
            return serverError(error);
        }
    }

    async addPlate(plateData: CreatePlateDTO) {
        try {
            const result = await this.dataAccess.addPlate(plateData);
            return ok(result);
        } catch (error) {
            return serverError(error);
        }
    }

    async deletePlate(plateId: string) {
        try {
            const result = await this.dataAccess.deletePlate(plateId);
            return ok(result);
        } catch (error) {
            return serverError(error);
        }
    }

    async updatePlate(plateId: string, plateData: UpdatePlateDTO) {
        try {
            const result = await this.dataAccess.updatePlate(plateId, plateData);
            return ok(result);
        } catch (error) {
            return serverError(error);
        }
    }

}
