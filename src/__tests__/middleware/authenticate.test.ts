import { describe, it, expect, vi } from 'vitest';
import jwt from 'jsonwebtoken';
import { authenticate } from '../../middleware/authenticate.js';
import type { Request, Response } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';

function createMockReq(authHeader?: string) {
    return {
        headers: authHeader ? { authorization: authHeader } : {},
    } as Request;
}

function createMockRes() {
    const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
    } as unknown as Response;
    return res;
}

describe('authenticate middleware', () => {
    it('should return 401 when no authorization header', () => {
        const req = createMockReq();
        const res = createMockRes();
        const next = vi.fn();

        authenticate(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 when token is malformed', () => {
        const req = createMockReq('Bearer invalidtoken');
        const res = createMockRes();
        const next = vi.fn();

        authenticate(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 when token is expired', () => {
        const token = jwt.sign({ _id: '123', fullname: 'Test', email: 'test@test.com' }, JWT_SECRET, { expiresIn: '-1s' });
        const req = createMockReq(`Bearer ${token}`);
        const res = createMockRes();
        const next = vi.fn();

        authenticate(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 when token has wrong signature', () => {
        const token = jwt.sign({ _id: '123' }, 'wrong-secret');
        const req = createMockReq(`Bearer ${token}`);
        const res = createMockRes();
        const next = vi.fn();

        authenticate(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    it('should call next and set user when token is valid', () => {
        const payload = { _id: '123', fullname: 'Test User', email: 'test@test.com' };
        const token = jwt.sign(payload, JWT_SECRET);
        const req = createMockReq(`Bearer ${token}`);
        const res = createMockRes();
        const next = vi.fn();

        authenticate(req, res, next);
        expect(next).toHaveBeenCalled();
        expect((req as any).user).toBeDefined();
        expect((req as any).user._id).toBe('123');
    });

    it('should return 401 when header does not start with Bearer', () => {
        const req = createMockReq('Basic abc123');
        const res = createMockRes();
        const next = vi.fn();

        authenticate(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });
});
