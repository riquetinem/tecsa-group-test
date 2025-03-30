'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Statuses', [
      { name: 'Pendente', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Em andamento', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Concluída', createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Statuses', null, {});
  },
};
