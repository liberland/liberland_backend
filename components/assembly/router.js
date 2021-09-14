const Router = require('koa-router');

const {
  addNewDraft, getMyProposals, deleteDraft, editDraft, getProposalsByHash, verifyProposalHash,
} = require('./service');

const router = new Router({
  prefix: '/assembly',
});

router.get('/calc_hash/:id', verifyProposalHash);
router.post('/add_new_draft', addNewDraft);
router.post('/get_my_proposals', getMyProposals);
router.post('/proposals_hashes', getProposalsByHash);
router.patch('/edit_draft/:id', editDraft);
router.delete('/delete_draft/:id', deleteDraft);

module.exports = router;
