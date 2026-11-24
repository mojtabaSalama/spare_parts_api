const app = require('./app');
const env = require('./config/env');
const { sequelize } = require('./models');
const logger = require('./utils/logger');

async function start() {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established successfully');

    // In development you can sync models automatically; in production use migrations instead.
    if (env.nodeEnv === 'development') {
      await sequelize.sync({ alter: true });
      logger.info('Create or update tables directly from the Sequelize model definitions.');
    }

    app.listen(env.port, () => {
      logger.info(`API listening on http://localhost:${env.port}`);
    });
  } catch (err) {
    const cause = err?.parent || err?.original;
    const causeMessages = cause?.errors?.map((error) => error.message).filter(Boolean);
    const message = causeMessages?.length ? causeMessages.join('; ') : cause?.message || err.message;
    logger.error('Unable to start the server:', `${err.name || 'Error'}${message ? `: ${message}` : ''}`);
    process.exit(1);
  }
}

start();
