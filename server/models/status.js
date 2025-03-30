'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const Status = sequelize.define('Status', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  }, { timestamps: true });

  Status.associate = (models) => {
    Status.hasMany(models.Task, { foreignKey: 'statusId' });
  };

  return Status;
};
