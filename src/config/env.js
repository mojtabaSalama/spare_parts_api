require('dotenv').config();
const crypto = require('crypto');

const required = ['DB_NAME', 'DB_USER', 'DB_DIALECT', 'JWT_SECRET'];

const missing = required.filter((key) => !process.env[key] && process.env[key] !== '');
const refreshSecret = process.env.JWT_REFRESH_SECRET || (process.env.JWT_SECRET
  ? crypto.createHmac('sha256', process.env.JWT_SECRET).update('spare-parts-api:refresh-token').digest('hex')
  : undefined);

if (missing.length > 0) {
  // eslint-disable-next-line no-console
  console.warn(`Warning: missing recommended env vars: ${missing.join(', ')}`);
}

module.exports = {
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV || 'development',

  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dialect: process.env.DB_DIALECT,
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    refreshSecret,
    expiresIn: process.env.JWT_EXPIRES_IN || '8h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  clientOrigin: process.env.CLIENT_ORIGIN || '*',
};