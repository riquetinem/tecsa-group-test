'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Task extends Model {
    static associate(models) {
      Task.belongsTo(models.Statuses, { foreignKey: 'statusId' });
    }
  }

  Task.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      statusId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Statuses',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'Task',
      timestamps: true,
    }
  );

  return Task;
};
