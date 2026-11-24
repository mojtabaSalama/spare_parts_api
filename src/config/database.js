require('dotenv').config();

// This file serves two roles:
// 1. sequelize-cli reads the exported plain object (per NODE_ENV) for migrations/seeders
// 2. The app itself uses config/env.js + models/index.js for the live connection
//
// Keeping this simple/plain-object format is required for sequelize-cli compatibility.

module.exports = {
  development: {
    username: process.env.DB_USER ,
    password: process.env.DB_PASSWORD ,
    database: process.env.DB_NAME ,
    host: process.env.DB_HOST ,
    port: process.env.DB_PORT ,
    dialect: process.env.DB_DIALECT ,
  },
  test: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || null,
    database: `${process.env.DB_NAME || 'spare_parts'}_test`,
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: false,
  },
};
