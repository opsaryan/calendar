import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import request from 'supertest';
import app from '../app.js';
import User from '../models/User.js';
import { useTestDatabase } from './setup.js';

const user = { name: 'Jane Doe', email: 'jane@example.com', password: 'secret123' };

const register = (body = user) => request(app).post('/api/auth/new').send(body);

describe('Auth routes', () => {
  useTestDatabase();

  describe('POST /api/auth/new', () => {
    test('creates a user and returns a token', async () => {
      const res = await register();

      assert.equal(res.status, 201);
      assert.equal(res.body.ok, true);
      assert.equal(res.body.name, user.name);
      assert.ok(res.body.uid);
      assert.ok(res.body.token);
    });

    test('stores the password hashed', async () => {
      await register();
      const stored = await User.findOne({ email: user.email });

      assert.notEqual(stored.password, user.password);
      assert.match(stored.password, /^\$2[aby]\$/);
    });

    test('rejects duplicate email', async () => {
      await register();
      const res = await register();

      assert.equal(res.status, 400);
      assert.equal(res.body.msg, 'One user exists with that email');
    });

    test('validates name, email and password', async () => {
      const res = await register({ name: '', email: 'nope', password: '123' });

      assert.equal(res.status, 400);
      assert.deepEqual(Object.keys(res.body.errors).sort(), ['email', 'name', 'password']);
    });
  });

  describe('POST /api/auth/login', () => {
    test('logs in an existing user', async () => {
      await register();
      const res = await request(app).post('/api/auth/login').send({ email: user.email, password: user.password });

      assert.equal(res.status, 200);
      assert.equal(res.body.ok, true);
      assert.equal(res.body.name, user.name);
      assert.ok(res.body.token);
    });

    test('rejects unknown user', async () => {
      const res = await request(app).post('/api/auth/login').send({ email: 'ghost@example.com', password: 'secret123' });

      assert.equal(res.status, 400);
      assert.equal(res.body.ok, false);
    });

    test('rejects wrong password', async () => {
      await register();
      const res = await request(app).post('/api/auth/login').send({ email: user.email, password: 'wrongpass' });

      assert.equal(res.status, 400);
      assert.equal(res.body.msg, 'Incorrect email or password');
    });

    test('validates payload', async () => {
      const res = await request(app).post('/api/auth/login').send({ email: 'bad', password: '1' });

      assert.equal(res.status, 400);
      assert.ok(res.body.errors.email);
      assert.ok(res.body.errors.password);
    });
  });

  describe('GET /api/auth/renew', () => {
    test('returns a fresh token for a valid one', async () => {
      const { body } = await register();
      const res = await request(app).get('/api/auth/renew').set('x-token', body.token);

      assert.equal(res.status, 200);
      assert.equal(res.body.uid, body.uid);
      assert.equal(res.body.name, user.name);
      assert.ok(res.body.token);
    });

    test('requires a token', async () => {
      const res = await request(app).get('/api/auth/renew');

      assert.equal(res.status, 401);
    });
  });
});
