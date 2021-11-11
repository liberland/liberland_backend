'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WalletTx extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  WalletTx.init({
    account_from: DataTypes.STRING,
    account_to: DataTypes.STRING,
    amount: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'WalletTx',
  });
  return WalletTx;
};