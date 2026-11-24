module.exports = (sequelize, DataTypes) => {
  const Supplier = sequelize.define(
    'Supplier',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(150),
        allowNull: false,
        set(value) {
          this.setDataValue('name', String(value).trim());
        },
        validate: { notEmpty: true, len: [1, 150] },
      },
      contactName: {
        type: DataTypes.STRING(120),
        allowNull: true,
        field: 'contact_name',
      },
      phone: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(254),
        allowNull: true,
        set(value) {
          this.setDataValue('email', value ? String(value).trim().toLowerCase() : null);
        },
        validate: { isEmail: true },
      },
      address: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
    },
    {
      tableName: 'suppliers',
      underscored: true,
      timestamps: true,
      indexes: [{ fields: ['email'] }],
    }
  );

  Supplier.associate = (models) => {
    Supplier.hasMany(models.Part, {
      foreignKey: { name: 'supplierId', allowNull: true },
      as: 'parts',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  };

  return Supplier;
};
