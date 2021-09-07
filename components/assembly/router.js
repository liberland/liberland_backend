const Router = require('koa-router');

const {
  addNewDraft, getMyProposals, deleteDraft, editDraft,
} = require('./service');

const router = new Router({
  prefix: '/assembly',
});

router.post('/add_new_draft', addNewDraft);
router.post('/get_my_proposals', getMyProposals);
router.patch('/edit_draft/:id', editDraft);
router.delete('/delete_draft/:id', deleteDraft);

module.exports = router;
