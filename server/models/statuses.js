'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Statuses extends Model {
    static associate(models) {
      Statuses.hasMany(models.Task, { foreignKey: 'statusId' });
    }
  }

  Statuses.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: 'Statuses',
      timestamps: true,
    }
  );

  return Statuses;
};
