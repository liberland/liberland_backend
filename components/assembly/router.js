const Router = require('koa-router');

const {
  addNewDraft,
  getMyProposals,
  deleteDraft,
  editDraft,
  getProposalsByHash,
  verifyProposalHash,
  updateStatusProposal,
  updateAllProposals,
  getHashesProposalsNotDraft,
  calcHash,
  voteByProposal,
} = require('./service');

const router = new Router({
  prefix: '/assembly',
});

router.get('/calc_hash/:id', calcHash);
router.get('/verify_proposal_hash/:id', verifyProposalHash);
router.post('/add_new_draft', addNewDraft);
router.post('/get_my_proposals', getMyProposals);
router.post('/proposals_hashes', getProposalsByHash);
router.patch('/edit_draft/:id', editDraft);
router.delete('/delete_draft/:id', deleteDraft);
router.patch('/update_status_proposal', updateStatusProposal);
router.post('/update_all_proposals', updateAllProposals);
router.get('/get_hashes_proposals_not_draft', getHashesProposalsNotDraft);
router.post('/vote_by_proposal', voteByProposal);

module.exports = router;
