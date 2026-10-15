import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import jwt from 'jsonwebtoken';
import { isDate } from '../helpers/isDateValidator.js';
import { generateJWT } from '../helpers/jwt.js';
import './setup.js';

describe('isDate', () => {
  test('accepts valid dates', () => {
    assert.equal(isDate('2024-05-01T10:00:00.000Z'), true);
    assert.equal(isDate(1714557600000), true);
    assert.equal(isDate(new Date()), true);
  });

  test('rejects empty or invalid values', () => {
    assert.equal(isDate(undefined), false);
    assert.equal(isDate(''), false);
    assert.equal(isDate(null), false);
    assert.equal(isDate('not a date'), false);
  });
});

describe('generateJWT', () => {
  test('signs a token carrying uid and name', async () => {
    const token = await generateJWT('abc123', 'Jane');
    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);

    assert.equal(payload.uid, 'abc123');
    assert.equal(payload.name, 'Jane');
  });

  test('token expires in 2 hours', async () => {
    const token = await generateJWT('abc123', 'Jane');
    const { iat, exp } = jwt.decode(token);

    assert.equal(exp - iat, 2 * 60 * 60);
  });
});
