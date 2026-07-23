import { describe, it, expect, vi } from 'vitest';
import { ok, serverError, notFound, badRequest } from '../../helpers/httpResponse.js';

describe('httpResponse', () => {
    describe('ok', () => {
        it('should return 200 with success true', () => {
            const result = ok({ name: 'test' });
            expect(result.success).toBe(true);
            expect(result.statusCode).toBe(200);
            expect(result.body).toEqual({ name: 'test' });
        });
    });

    describe('serverError', () => {
        it('should return 500 with success false', () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            const result = serverError(new Error('test'));
            expect(result.success).toBe(false);
            expect(result.statusCode).toBe(500);
            expect(result.body).toEqual({ message: 'Internal server error' });
            consoleSpy.mockRestore();
        });

        it('should not leak error details to client', () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            const result = serverError(new Error('db connection failed'));
            expect(JSON.stringify(result.body)).not.toContain('db connection');
            consoleSpy.mockRestore();
        });
    });

    describe('notFound', () => {
        it('should return 404 with message', () => {
            const result = notFound('Resource not found');
            expect(result.success).toBe(false);
            expect(result.statusCode).toBe(404);
            expect(result.body).toEqual({ message: 'Resource not found' });
        });
    });

    describe('badRequest', () => {
        it('should return 400 with message', () => {
            const result = badRequest('Invalid input');
            expect(result.success).toBe(false);
            expect(result.statusCode).toBe(400);
            expect(result.body).toEqual({ message: 'Invalid input' });
        });
    });
});
