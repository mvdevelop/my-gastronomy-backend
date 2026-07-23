import { describe, it, expect, vi } from 'vitest';
import { validate } from '../../middleware/validate.js';
import type { Request, Response } from 'express';

function createMockReq(body: Record<string, unknown>) {
    return { body } as Request;
}

function createMockRes() {
    const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
    } as unknown as Response;
    return res;
}

describe('validate middleware', () => {
    it('should call next when all required fields are present', () => {
        const middleware = validate([
            { field: 'name', required: true, type: 'string' },
        ]);
        const req = createMockReq({ name: 'John' });
        const res = createMockRes();
        const next = vi.fn();

        middleware(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('should return 400 when required field is missing', () => {
        const middleware = validate([
            { field: 'name', required: true, type: 'string' },
        ]);
        const req = createMockReq({});
        const res = createMockRes();
        const next = vi.fn();

        middleware(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 when type is wrong', () => {
        const middleware = validate([
            { field: 'age', required: true, type: 'number' },
        ]);
        const req = createMockReq({ age: 'not a number' });
        const res = createMockRes();
        const next = vi.fn();

        middleware(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 when string is too short', () => {
        const middleware = validate([
            { field: 'name', required: true, type: 'string', minLength: 3 },
        ]);
        const req = createMockReq({ name: 'ab' });
        const res = createMockRes();
        const next = vi.fn();

        middleware(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 when pattern does not match', () => {
        const middleware = validate([
            { field: 'email', required: true, type: 'string', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
        ]);
        const req = createMockReq({ email: 'invalid' });
        const res = createMockRes();
        const next = vi.fn();

        middleware(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should pass when optional field is missing', () => {
        const middleware = validate([
            { field: 'nickname', type: 'string' },
        ]);
        const req = createMockReq({});
        const res = createMockRes();
        const next = vi.fn();

        middleware(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('should report multiple errors', () => {
        const middleware = validate([
            { field: 'name', required: true, type: 'string' },
            { field: 'email', required: true, type: 'string' },
        ]);
        const req = createMockReq({});
        const res = createMockRes();
        const next = vi.fn();

        middleware(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(next).not.toHaveBeenCalled();
    });
});
