// User routes / Auth
// host + /api/auth
import { Router } from 'express';
import { check } from 'express-validator';
import { createUser, login, renewToken } from '../controllers/auth.js';
import { validateFields } from '../middlewares/fieldsValidator.js';
import { validateJWT } from '../middlewares/jwtValidator.js';

const router = Router();

router.post(
  '/new',
  [
    //middlewares
    check('name', 'Name is mandatory').not().isEmpty(),
    check('email', 'Email is not valid').isEmail(),
    check('password', 'Password must have at least 5 characters').isLength({ min: 5 }),
    validateFields,
  ],
  createUser,
);

router.post(
  '/login',
  [check('email', 'Not valid email').isEmail(), check('password', 'Password length must be greater that 5').isLength({ min: 5 }), validateFields],
  login,
);

router.get('/renew', validateJWT, renewToken);

export default router;
