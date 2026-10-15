import { request, response } from 'express';
import jwt from 'jsonwebtoken';

export const validateJWT = (req = request, res = response, next) => {
  // x-token coming in headers
  const token = req.header('x-token');

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: 'No token in request',
    });
  }

  try {
    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);

    req.uid = payload.uid;
    req.name = payload.name;
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: 'Token not valid or expired',
    });
  }

  next();
};
