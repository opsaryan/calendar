import assert from 'node:assert/strict';
import { beforeEach, describe, test } from 'node:test';
import request from 'supertest';
import app from '../app.js';
import { useTestDatabase } from './setup.js';

const event = {
  title: 'Standup',
  notes: 'Daily sync',
  start: '2024-05-01T09:00:00.000Z',
  end: '2024-05-01T09:15:00.000Z',
};

const createUser = async (email) => {
  const res = await request(app)
    .post('/api/auth/new')
    .send({ name: email.split('@')[0], email, password: 'secret123' });
  return res.body;
};

const createEvent = (token, body = event) => request(app).post('/api/events').set('x-token', token).send(body);

describe('Events routes', () => {
  useTestDatabase();

  let owner;
  let stranger;

  beforeEach(async () => {
    owner = await createUser('owner@example.com');
    stranger = await createUser('stranger@example.com');
  });

  test('all routes require a token', async () => {
    const responses = await Promise.all([
      request(app).get('/api/events'),
      request(app).post('/api/events').send(event),
      request(app).put('/api/events/507f1f77bcf86cd799439011').send(event),
      request(app).delete('/api/events/507f1f77bcf86cd799439011'),
    ]);

    responses.forEach((res) => assert.equal(res.status, 401));
  });

  describe('POST /api/events', () => {
    test('creates an event owned by the caller', async () => {
      const res = await createEvent(owner.token);

      assert.equal(res.status, 201);
      assert.equal(res.body.event.title, event.title);
      assert.equal(res.body.event.user, owner.uid);
      assert.ok(res.body.event.id);
      assert.equal(res.body.event._id, undefined);
      assert.equal(res.body.event.__v, undefined);
    });

    test('validates title and dates', async () => {
      const res = await createEvent(owner.token, { title: '', start: 'nope', end: '' });

      assert.equal(res.status, 400);
      assert.deepEqual(Object.keys(res.body.errors).sort(), ['end', 'start', 'title']);
    });
  });

  describe('GET /api/events', () => {
    test('returns only the caller events', async () => {
      await createEvent(owner.token);
      await createEvent(owner.token, { ...event, title: 'Lunch' });
      await createEvent(stranger.token, { ...event, title: 'Private' });

      const res = await request(app).get('/api/events').set('x-token', owner.token);

      assert.equal(res.status, 200);
      assert.deepEqual(res.body.events.map((e) => e.title).sort(), ['Lunch', 'Standup']);
      assert.equal(res.body.events[0].user.name, 'owner');
    });
  });

  describe('PUT /api/events/:id', () => {
    test('updates own event', async () => {
      const { body } = await createEvent(owner.token);
      const res = await request(app)
        .put(`/api/events/${body.event.id}`)
        .set('x-token', owner.token)
        .send({ ...event, title: 'Retro' });

      assert.equal(res.status, 200);
      assert.equal(res.body.event.title, 'Retro');
    });

    test('cannot update someone else event', async () => {
      const { body } = await createEvent(owner.token);
      const res = await request(app).put(`/api/events/${body.event.id}`).set('x-token', stranger.token).send(event);

      assert.equal(res.status, 401);
    });

    test('returns 404 for unknown event', async () => {
      const res = await request(app).put('/api/events/507f1f77bcf86cd799439011').set('x-token', owner.token).send(event);

      assert.equal(res.status, 404);
    });

    test('returns 500 for malformed id', async () => {
      const res = await request(app).put('/api/events/not-an-id').set('x-token', owner.token).send(event);

      assert.equal(res.status, 500);
    });
  });

  describe('DELETE /api/events/:id', () => {
    test('deletes own event', async () => {
      const { body } = await createEvent(owner.token);
      const res = await request(app).delete(`/api/events/${body.event.id}`).set('x-token', owner.token);

      assert.equal(res.status, 200);

      const list = await request(app).get('/api/events').set('x-token', owner.token);
      assert.equal(list.body.events.length, 0);
    });

    test('cannot delete someone else event', async () => {
      const { body } = await createEvent(owner.token);
      const res = await request(app).delete(`/api/events/${body.event.id}`).set('x-token', stranger.token);

      assert.equal(res.status, 401);
    });

    test('returns 404 for unknown event', async () => {
      const res = await request(app).delete('/api/events/507f1f77bcf86cd799439011').set('x-token', owner.token);

      assert.equal(res.status, 404);
    });
  });
});
