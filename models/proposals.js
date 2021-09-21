'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class proposals extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  proposals.init({
    userId: DataTypes.INTEGER,
    proposalStatus: DataTypes.STRING,
    proposalName: DataTypes.STRING,
    fileName: DataTypes.STRING,
    shortDescription: DataTypes.STRING,
    threadLink: DataTypes.STRING,
    createdDate: DataTypes.STRING,
    requiredAmountLlm: DataTypes.STRING,
    currentLlm: DataTypes.STRING,
    votingHourLeft: DataTypes.STRING,
    docHash: DataTypes.STRING,
    draftType: DataTypes.STRING,
    nodeIdProposel: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'proposals',
  });
  return proposals;
};