'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Tasks', 'statusId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Status',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.removeColumn('Tasks', 'status');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Tasks', 'status', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.removeColumn('Tasks', 'statusId');
  }
};
