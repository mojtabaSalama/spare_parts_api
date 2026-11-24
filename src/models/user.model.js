module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(120),
        allowNull: false,
        validate: { notEmpty: true, len: [1, 120] },
      },
      email: {
        type: DataTypes.STRING(254),
        allowNull: false,
        unique: true,
        set(value) {
          this.setDataValue('email', String(value).trim().toLowerCase());
        },
        validate: { isEmail: true, notEmpty: true },
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'password_hash',
      },
      role: {
        type: DataTypes.ENUM('admin', 'staff'),
        allowNull: false,
        defaultValue: 'staff',
        validate: { isIn: [['admin', 'staff']] },
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active',
      },
    },
    {
      tableName: 'users',
      underscored: true,
      timestamps: true,
      indexes: [{ unique: true, fields: ['email'] }],
      defaultScope: { attributes: { exclude: ['passwordHash'] } },
      scopes: { withPassword: { attributes: {} } },
    }
  );

  User.associate = (models) => {
    User.hasMany(models.StockMovement, {
      foreignKey: { name: 'userId', allowNull: false },
      as: 'stockMovements',
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    });
  };

  return User;
};
