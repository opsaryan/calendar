import { request, response } from 'express';
import Event from '../models/Event.js';

export const createEvent = async (req = request, res = response) => {
  const event = new Event(req.body);

  try {
    // req.uid coming from jwtValidator middleware
    event.user = req.uid;

    const savedEvent = await event.save();

    return res.status(201).json({
      ok: true,
      event: savedEvent,
      msg: 'Event created',
    });
    //
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: 'Internal error event',
    });
  }
};

export const getEvents = async (req = request, res = response) => {
  try {
    const userId = req.uid;
    const events = await Event.find({ user: userId }).populate('user', 'name');

    return res.status(200).json({
      ok: true,
      events,
      msg: 'getEvents',
    });
    //
  } catch (error) {
    console.log(`getEvents\n${error}`);
    return res.status(500).json({
      ok: false,
      msg: 'Internal error event',
    });
  }
};

export const updateEvent = async (req = request, res = response) => {
  const eventId = req.params.id;
  const uid = req.uid;

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        ok: false,
        msg: 'No event found by that id',
      });
    }

    if (event.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: 'That user did not created the event',
      });
    }

    const updatedEventInfo = {
      ...req.body,
      user: uid,
    };

    const updatedEvent = await Event.findByIdAndUpdate(eventId, updatedEventInfo, {
      new: true,
    });

    // ok
    return res.status(200).json({
      ok: true,
      event: updatedEvent,
      msg: 'Event updated',
    });
    //
  } catch (error) {
    console.log(`updateEvent\n${error}`);

    return res.status(500).json({
      ok: false,
      msg: 'Internal error event',
    });
  }
};

export const deleteEvent = async (req = request, res = response) => {
  const eventId = req.params.id;
  const userId = req.uid;

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        ok: false,
        msg: 'Event not found',
      });
    }

    if (event.user.toString() !== userId) {
      return res.status(401).json({
        ok: false,
        msg: 'User does not have privileges to delete the event',
      });
    }

    await Event.findByIdAndDelete(eventId);

    return res.status(200).json({
      ok: true,
      event: eventId,
      msg: 'Event deleted',
    });
  } catch (error) {
    console.log(`deleteEvent\n${error}`);

    return res.status(500).json({
      ok: false,
      msg: 'Internal error event',
    });
  }
};
