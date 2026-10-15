// Events routes / Events
// host + /api/events
import { Router } from 'express';
import { check } from 'express-validator';
const router = Router();

import { createEvent, deleteEvent, getEvents, updateEvent } from '../controllers/events.js';
import { isDate } from '../helpers/isDateValidator.js';
import { validateFields } from '../middlewares/fieldsValidator.js';
import { validateJWT } from '../middlewares/jwtValidator.js';

// High order middleware, all the routes use it
router.use(validateJWT);

router.post(
  '/',
  [
    check('title', 'Title is necessary').not().isEmpty(),
    check('start', 'Start date is not valid').custom(isDate),
    check('end', 'End date is not valid').custom(isDate),
    validateFields,
  ],
  createEvent
);

router.get('/', getEvents);

router.put(
  '/:id',
  [
    check('title', 'Title is necessary').not().isEmpty(),
    check('start', 'Start date is not valid').custom(isDate),
    check('end', 'End date is not valid').custom(isDate),
    validateFields,
  ],
  updateEvent
);

router.delete('/:id', deleteEvent);

export default router;
