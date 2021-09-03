const Router = require('koa-router');

const { addNewDraft, getMyProposals } = require('./service');

const router = new Router({
  prefix: '/assembly',
});

router.post('/add_new_draft', addNewDraft);
router.post('/get_my_proposals', getMyProposals);

module.exports = router;
