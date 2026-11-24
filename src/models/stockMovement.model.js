module.exports = (sequelize, DataTypes) => {
  const StockMovement = sequelize.define(
    'StockMovement',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      partId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'part_id',
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',
      },
      type: {
        type: DataTypes.ENUM('IN', 'OUT', 'ADJUSTMENT'),
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1 },
      },
      reason: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
    },
    {
      tableName: 'stock_movements',
      underscored: true,
      timestamps: true,
      updatedAt: false, // movements are immutable, only createdAt matters
      indexes: [{ fields: ['part_id'] }, { fields: ['user_id'] }],
    }
  );

  StockMovement.associate = (models) => {
    StockMovement.belongsTo(models.Part, {
      foreignKey: { name: 'partId', allowNull: false },
      as: 'part',
      onDelete: 'RESTRICT',
    });
    StockMovement.belongsTo(models.User, {
      foreignKey: { name: 'userId', allowNull: false },
      as: 'user',
      onDelete: 'RESTRICT',
    });
  };

  return StockMovement;
};
