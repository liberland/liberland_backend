const Router = require('koa-router');
const {
  insertTxToDb,
  getAllTxByAddress,
  getTreeTx,
} = require('./service');

const router = new Router({
  prefix: '/wallet',
});

router.post('/insert_tx', insertTxToDb);
router.get('/get_all_tx_by_address', getAllTxByAddress);
router.post('/get_tree_tx', getTreeTx);
// router.get();
module.exports = router;
