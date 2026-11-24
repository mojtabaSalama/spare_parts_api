module.exports = (sequelize, DataTypes) => {
  const Part = sequelize.define(
    'Part',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      sku: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        set(value) {
          this.setDataValue('sku', String(value).trim().toUpperCase());
        },
        validate: { notEmpty: true, len: [1, 50] },
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: { notEmpty: true },
      },
      description: {
        type: DataTypes.STRING(1000),
        allowNull: true,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0 },
      },
      minStockLevel: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 5,
        field: 'min_stock_level',
        validate: { min: 0 },
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0 },
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'category_id',
      },
      supplierId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'supplier_id',
      },
    },
    {
      tableName: 'parts',
      underscored: true,
      timestamps: true,
      indexes: [
        { unique: true, fields: ['sku'] },
        { fields: ['category_id'] },
        { fields: ['supplier_id'] },
      ],
    }
  );

  Part.associate = (models) => {
    Part.belongsTo(models.Category, {
      foreignKey: { name: 'categoryId', allowNull: true },
      as: 'category',
      onDelete: 'SET NULL',
    });
    Part.belongsTo(models.Supplier, {
      foreignKey: { name: 'supplierId', allowNull: true },
      as: 'supplier',
      onDelete: 'SET NULL',
    });
    Part.hasMany(models.StockMovement, {
      foreignKey: { name: 'partId', allowNull: false },
      as: 'movements',
      onDelete: 'RESTRICT',
    });
  };

  return Part;
};
