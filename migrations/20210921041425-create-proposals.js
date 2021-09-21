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
        type: Sequelize.STRING
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
        type: Sequelize.STRING
      },
      currentLlm: {
        type: Sequelize.STRING
      },
      votingHourLeft: {
        type: Sequelize.STRING
      },
      docHash: {
        type: Sequelize.STRING
      },
      draftType: {
        type: Sequelize.STRING
      },
      nodeIdProposel: {
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