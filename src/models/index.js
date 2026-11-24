const { Sequelize } = require('sequelize');
const env = require('../config/env');

const sequelize = new Sequelize(env.db.name, env.db.user, env.db.password, {
  host: env.db.host,
  port: env.db.port,
  dialect: env.db.dialect,
  logging: false,
  timezone: '+00:00',
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    underscored: true,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./user.model')(sequelize, Sequelize.DataTypes);
db.Category = require('./category.model')(sequelize, Sequelize.DataTypes);
db.Supplier = require('./supplier.model')(sequelize, Sequelize.DataTypes);
db.Part = require('./part.model')(sequelize, Sequelize.DataTypes);
db.StockMovement = require('./stockMovement.model')(sequelize, Sequelize.DataTypes);

Object.values(db).forEach((model) => {
  if (model.associate) {
    model.associate(db);
  }
});

module.exports = db;
