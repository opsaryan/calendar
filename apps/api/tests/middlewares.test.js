import assert from 'node:assert/strict';
import { describe, mock, test } from 'node:test';
import jwt from 'jsonwebtoken';
import { validateJWT } from '../middlewares/jwtValidator.js';
import './setup.js';

const mockRes = () => {
  const res = {};
  res.status = mock.fn(() => res);
  res.json = mock.fn(() => res);
  return res;
};

const mockReq = (token) => ({ header: () => token });

describe('validateJWT', () => {
  test('rejects request without token', () => {
    const res = mockRes();
    const next = mock.fn();

    validateJWT(mockReq(undefined), res, next);

    assert.equal(res.status.mock.calls[0].arguments[0], 401);
    assert.equal(next.mock.callCount(), 0);
  });

  test('rejects invalid token', () => {
    const res = mockRes();
    const next = mock.fn();

    validateJWT(mockReq('garbage'), res, next);

    assert.equal(res.status.mock.calls[0].arguments[0], 401);
    assert.equal(next.mock.callCount(), 0);
  });

  test('rejects expired token', () => {
    const token = jwt.sign({ uid: '1', name: 'A', exp: Math.floor(Date.now() / 1000) - 10 }, process.env.SECRET_JWT_SEED);
    const res = mockRes();
    const next = mock.fn();

    validateJWT(mockReq(token), res, next);

    assert.equal(res.status.mock.calls[0].arguments[0], 401);
    assert.equal(next.mock.callCount(), 0);
  });

  test('attaches uid and name and calls next on valid token', () => {
    const token = jwt.sign({ uid: 'u1', name: 'Jane' }, process.env.SECRET_JWT_SEED);
    const req = mockReq(token);
    const res = mockRes();
    const next = mock.fn();

    validateJWT(req, res, next);

    assert.equal(next.mock.callCount(), 1);
    assert.equal(req.uid, 'u1');
    assert.equal(req.name, 'Jane');
  });
});
