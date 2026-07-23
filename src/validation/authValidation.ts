import { validate } from '../middleware/validate.js';

export const signupValidation = validate([
    { field: 'fullname', required: true, type: 'string', minLength: 2, maxLength: 100 },
    { field: 'email', required: true, type: 'string', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    { field: 'password', required: true, type: 'string', minLength: 8 },
]);

export const loginValidation = validate([
    { field: 'email', required: true, type: 'string' },
    { field: 'password', required: true, type: 'string' },
]);
