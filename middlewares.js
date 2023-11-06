import { json, urlencoded } from 'express';
import basicAuth from 'express-basic-auth';

import { SECURE_TOKEN, SECURE_USERNAME } from './const.js';
import { logger } from './logger.js';

export const jsonParser = json({ limit: '1mb' });
export const urlencodedParser = urlencoded({ extended: true });
export const cors = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS, GET, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
};

export const infoLogger = (req, res, next) => {
  const ip = req.get('X-Real-IP') || req.ip;
  logger.info(`[${ip}] [${req.method}] ${req.url} `);
  next();
};

export const noMatch = (req, res, next) => {
  if (!req.route) {
    return next({ message: 'No such path', error: 'error' });
  }
  return next();
};

export const errorHandler = (error, req, res, next) => {
  const { message, type, data } = error;
  logger.error(message);
  res.json({ message, type: type || 'error', data: data || null });
  next();
};

export const authChecker = basicAuth({
  users: { [SECURE_USERNAME]: SECURE_TOKEN },
  challenge: true,
});
