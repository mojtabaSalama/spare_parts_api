module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    'Category',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(120),
        allowNull: false,
        unique: true,
        set(value) {
          this.setDataValue('name', String(value).trim());
        },
        validate: {
          notEmpty: true,
          len: [1, 120],
        },
      },
      description: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
    },
    {
      tableName: 'categories',
      underscored: true,
      timestamps: true,
      indexes: [{ unique: true, fields: ['name'] }],
    }
  );

  Category.associate = (models) => {
    Category.hasMany(models.Part, {
      foreignKey: { name: 'categoryId', allowNull: true },
      as: 'parts',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  };

  return Category;
};
