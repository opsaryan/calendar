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

  test('unknown routes return a JSON 404', async () => {
    const res = await request(app).get('/calendar');

    assert.equal(res.status, 404);
    assert.deepEqual(res.body, { ok: false, msg: 'Route not found' });
  });
});
