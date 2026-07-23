import { validate } from '../middleware/validate.js';

export const createPlateValidation = validate([
    { field: 'name', required: true, type: 'string', minLength: 1 },
    { field: 'price', required: true, type: 'number', min: 0 },
    { field: 'available', required: true, type: 'boolean' },
    { field: 'description', required: true, type: 'string' },
    { field: 'ingredients', required: true, type: 'array' },
    { field: 'imgUrl', required: true, type: 'string' },
    { field: 'category', required: true, type: 'string' },
]);

export const updatePlateValidation = validate([
    { field: 'name', type: 'string', minLength: 1 },
    { field: 'price', type: 'number', min: 0 },
    { field: 'available', type: 'boolean' },
    { field: 'description', type: 'string' },
    { field: 'ingredients', type: 'array' },
    { field: 'imgUrl', type: 'string' },
    { field: 'category', type: 'string' },
]);
