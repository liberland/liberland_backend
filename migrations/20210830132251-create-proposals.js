'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('proposals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER
      },
      proposalStatus: {
        type: Sequelize.INTEGER
      },
      proposalName: {
        type: Sequelize.STRING
      },
      fileName: {
        type: Sequelize.STRING
      },
      shortDescription: {
        type: Sequelize.STRING
      },
      threadLink: {
        type: Sequelize.STRING
      },
      createdDate: {
        type: Sequelize.STRING
      },
      requiredAmountLlm: {
        type: Sequelize.INTEGER
      },
      currentLlm: {
        type: Sequelize.INTEGER
      },
      votingHourLeft: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('proposals');
  }
};