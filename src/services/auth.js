import crypto from 'node:crypto';
import bcrypt from 'bcrypt';

import jwt from 'jsonwebtoken';

import Handlebars from 'handlebars';
import path from 'node:path';
import * as fs from 'node:fs';

import createHttpError from 'http-errors';
import { User } from '../db/models/userSchema.js';
import { Session } from '../db/models/SessionSchema.js';
import { getEnvVariable } from '../utils/getEnvVariable.js';
import { sendMail } from '../utils/sendMail.js';
const RESET_PASSWORD_EMAIL = fs.readFileSync(
  path.resolve('src/templates/reset-password-email.html'),
  { encoding: 'UTF-8' },
);

export const registerUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });

  if (user !== null) {
    throw createHttpError.Conflict('Email is already is use');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await User.create({
    ...payload,
    password: encryptedPassword,
  });
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });

  if (user === null) {
    throw new createHttpError.Unauthorized('Email or password is incorrect');
  }

  const isEqual = await bcrypt.compare(password, user.password);

  if (isEqual !== true) {
    throw new createHttpError.Unauthorized('Email or password is incorrect');
  }

  await Session.deleteOne({ userId: user._id });

  return Session.create({
    userId: user._id,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 10 * 60 * 1000),
  });
};

export const logoutUser = async (sessionId) => {
  await Session.deleteOne({ _id: sessionId });
};

export const refreshSession = async (sessionId, refreshToken) => {
  const session = await Session.findById(sessionId);

  if (session === null) {
    throw new createHttpError.Unauthorized('Session not found');
  }

  if (session.refreshToken !== refreshToken) {
    throw new createHttpError.Unauthorized('Refresh token is invalid');
  }

  if (session.refreshTokenValidUntil < Date.now()) {
    throw new createHttpError.Unauthorized('Refresh token is expired');
  }

  await Session.deleteOne({ userId: session.userId });

  return Session.create({
    userId: session.userId,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 10 * 60 * 1000),
  });
};

export const requestResetPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new createHttpError.NotFound('User not found!');
  }
  const token = jwt.sign({ sub: user._id }, getEnvVariable('JWT_SECRET'), {
    expiresIn: '15m',
  });
  const template = Handlebars.compile(RESET_PASSWORD_EMAIL);
  await sendMail({
    to: email,
    subject: 'Reset password instruction',
    html: template({
      link: `http://localhost:3000/reset-password?token=${token}`,
      name: user.name,
    }),
  });
};

export const resetPassword = async (password, token) => {
  try {
    const decode = jwt.verify(token, getEnvVariable('JWT_SECRET'));

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(decode.sub, { password: hashedPassword });
  } catch (error) {
    if (
      error.name === 'TokenExpiredError' ||
      error.name === 'JsonWebTokenError'
    ) {
      throw new createHttpError.Unauthorized('Token is expired or invalid.');
    }
    throw error;
  }
};
