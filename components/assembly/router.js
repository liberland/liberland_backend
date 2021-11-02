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
  updatePowerProposal,
  getProposalsByStatusAndType,
  getAllProposalsApproved,
  getInProgressProposals,
  getTextPdf,
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
router.patch('/update_power_proposal', updatePowerProposal);
router.post('/get_proposals_byStatus_and_type', getProposalsByStatusAndType);
router.get('/get_all_proposals_approved', getAllProposalsApproved);
router.get('/get_in_progress_proposals', getInProgressProposals);
router.get('/get_text_pdf/:id', getTextPdf);

module.exports = router;
