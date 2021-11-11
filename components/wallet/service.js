const { Op } = require('sequelize');
const { WalletTx: WalletTxModel } = require('../../models');

const insertTxToDb = async (ctx) => {
  try {
    const {
      account_from,
      account_to,
      amount,
      status,
    } = ctx.request.body;

    await WalletTxModel.create({
      account_from,
      account_to,
      amount,
      status,
    });
  } catch (e) {
    ctx.throw(500, e);
  }
  ctx.body = { result: 'success' };
  ctx.status = 200;
};

const getAllTxByAddress = async (ctx) => {
  try {
    const { walletAddress } = ctx.request.body;
    ctx.body = {
      hashesNotDraft: await WalletTxModel.findAll({
        where: {
          [Op.or]: [
            { account_from: walletAddress }, { account_to: walletAddress },
          ],
        },
      }),
    };
  } catch (e) {
    ctx.throw(500, e);
  }
};
const getTreeTx = async (ctx) => {
  try {
    const { walletAddress } = ctx.request.body;
    ctx.body = {
      threeTx: await WalletTxModel.findAll({
        where: {
          [Op.or]: [
            { account_from: walletAddress }, { account_to: walletAddress },
          ],
        },
        limit: 3,
        order: [['createdAt', 'DESC']],
      }),
    };
  } catch (e) {
    ctx.throw(500, e);
  }
};

module.exports = {
  insertTxToDb,
  getAllTxByAddress,
  getTreeTx,
};
