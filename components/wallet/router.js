const Router = require('koa-router');
const {
  insertTxToDb,
  getMoreTx,
  getTreeTx,
} = require('./service');

const router = new Router({
  prefix: '/wallet',
});

router.post('/insert_tx', insertTxToDb);
router.post('/get_more_tx', getMoreTx);
router.post('/get_tree_tx', getTreeTx);
// router.get();
module.exports = router;
