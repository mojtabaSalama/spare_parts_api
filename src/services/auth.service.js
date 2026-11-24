const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const env = require('../config/env');
const ApiError = require('../utils/apiError');
const cache = require('../utils/cache');

const SALT_ROUNDS = 10;
const LOGIN_CACHE_TTL_MS = 60 * 1000;
const USER_CACHE_TTL_MS = 5 * 60 * 1000;

function loginCacheKey(email) {
  return `login:user:${String(email).trim().toLowerCase()}`;
}

function userCacheKey(userId) {
  return `auth:user:${userId}`;
}

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    env.jwt.secret,
    { expiresIn: env.jwt.expiresIn }
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    env.jwt.refreshSecret,
    { expiresIn: env.jwt.refreshExpiresIn }
  );
}

async function register({ name, email, password, role }) {
  const existing = await User.findOne({ where: { email } });
  if (existing) {
    throw ApiError.conflict('An account with this email already exists');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await User.create({
    name,
    email,
    passwordHash,
    role: role || 'staff',
  });

  cache.del(loginCacheKey(email));
  cache.del(userCacheKey(user.id));

  const token = generateToken(user);
  const refreshToken = generateRefreshToken(user);
  return { user, token, refreshToken };
}

async function login({ email, password }) {
  const normalizedEmail = String(email).trim().toLowerCase();
  const key = loginCacheKey(normalizedEmail);
  let user = cache.get(key);

  if (!user) {
    user = await User.scope('withPassword').findOne({ where: { email: normalizedEmail } });
    if (user) {
      cache.set(key, user, LOGIN_CACHE_TTL_MS);

      const safeUser = user.toJSON();
      delete safeUser.passwordHash;
      cache.set(userCacheKey(user.id), safeUser, USER_CACHE_TTL_MS);
    }
  }

  if (!user || !user.isActive) {
    throw ApiError.unauthorized('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw ApiError.unauthorized('Invalid credentials');
  }

  const token = generateToken(user);
  const refreshToken = generateRefreshToken(user);

  const safeUser = user.toJSON();
  delete safeUser.passwordHash;

  return { user: safeUser, token, refreshToken };
}

async function getCurrentUser(userId) {
  const key = userCacheKey(userId);
  let user = cache.get(key);

  if (!user) {
    user = await User.findByPk(userId);
    if (user) {
      cache.set(key, user, USER_CACHE_TTL_MS);
    }
  }

  if (!user) {
    throw ApiError.notFound('User not found');
  }
  return user;
}

async function refreshToken(token) {
  try {
    const decoded = jwt.verify(token, env.jwt.refreshSecret);
    const key = userCacheKey(decoded.id);
    let user = cache.get(key);

    if (!user) {
      user = await User.findByPk(decoded.id);
      if (user) {
        cache.set(key, user, USER_CACHE_TTL_MS);
      }
    }

    if (!user || !user.isActive) {
      throw ApiError.unauthorized('Invalid refresh token');
    }
    const newToken = generateToken(user);
    const newRefreshToken = generateRefreshToken(user);
    return { token: newToken, refreshToken: newRefreshToken };
  } catch (err) {
    throw ApiError.unauthorized('Invalid refresh token');
  }
}

module.exports = { register, login, getCurrentUser, generateToken, generateRefreshToken, refreshToken };