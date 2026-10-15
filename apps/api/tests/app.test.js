import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import request from 'supertest';
import app from '../app.js';
import './setup.js';

describe('App', () => {
  test('GET /health reports ok', async () => {
    const res = await request(app).get('/health');

    assert.equal(res.status, 200);
    assert.deepEqual(res.body, { ok: true, msg: 'API is running' });
  });
});
