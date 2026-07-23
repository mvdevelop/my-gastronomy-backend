import { validate } from '../middleware/validate.js';

export const createOrderValidation = validate([
    { field: 'userId', required: true, type: 'string' },
    { field: 'items', required: true, type: 'array' },
]);

export const updateOrderValidation = validate([
    { field: 'pickupStatus', type: 'string' },
]);
