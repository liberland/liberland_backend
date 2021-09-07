const pdfParse = require('pdf-parse');
const base64 = require('base64topdf');
const fs = require('fs');
const { proposals: ProposalsModel } = require('../../models');

function WritePdfFileException(message) {
  this.message = message;
  this.name = 'Custom exception';
}

const writePdfFile = async (file, fileName) => {

  if (!fs.existsSync('./proposals')) {
    fs.mkdirSync('./proposals');
  }

  const filePath = `./proposals/${fileName}.pdf`;
  const buf = () => Buffer.from(filePath, 'base64');
  if (buf) {
    await base64.base64Decode(file.slice(28), filePath);
    return (filePath);
  }
  throw new WritePdfFileException('Write file is fail');
};

const removeProposalFile = async (ctx, filename) => {
  const filePath = `./proposals/${filename}.pdf`;

  fs.stat(filePath, (err) => {
    if (err) {
      ctx.throw(500, 'Error during file deletion');
    }

    fs.unlink(filePath, (e) => {
      if (e) {
        ctx.throw(500, 'Error during file deletion');
      }
    });
  });
};

const writeDataToDb = (filePath) => new Promise((resolve, reject) => {
  const dataBuffer = fs.readFileSync(filePath);
  if (!dataBuffer) reject();

  pdfParse(dataBuffer).then((data) => {
    resolve(data.text);
  });
});

const addNewDraft = async (ctx) => {
  try {
    const {
      file,
      proposalName,
      shortDescription,
      threadLink,
      fileName,
      createdDate,
      userId,
      requiredAmountLlm,
      currentLlm,
      votingHourLeft,
    } = await ctx.request.body;

    await writePdfFile(file, fileName);
    await ProposalsModel.create({
      userId,
      proposalStatus: 0,
      proposalName,
      fileName,
      shortDescription,
      threadLink,
      createdDate,
      requiredAmountLlm,
      currentLlm,
      votingHourLeft,
    });
  } catch (e) {
    ctx.throw(500, e);
  }
  ctx.status = 200;
};

const getMyProposals = async (ctx) => {
  const { userId } = ctx.request.body;
  ctx.body = await ProposalsModel.findAll({
    where: {
      userId,
    },
  });
};

const getProposal = async (id) => {
  const proposal = await ProposalsModel.findOne({
    where: {
      id,
    },
  });
  if (!proposal) {
    throw new Error('Proposal not found');
  }
  return proposal;
};

const deleteDraft = async (ctx) => {
  const proposal = await getProposal(ctx.params.id);

  // TODO add better auth
  if (!ctx.isAuthenticated()) {
    ctx.throw(401, 'Unauthorized');
    return;
  }

  removeProposalFile(ctx, proposal.fileName);
  await proposal.destroy();
  ctx.status = 204;
};

const editDraft = async (ctx) => {
  const proposal = await getProposal(ctx.params.id);

  // TODO add better auth
  if (!ctx.isAuthenticated()) {
    ctx.throw(401, 'Unauthorized');
    return;
  }

  try {
    const {
      file,
      proposalName,
      shortDescription,
      threadLink,
      fileName,
    } = await ctx.request.body;
    removeProposalFile(ctx, proposal.fileName);

    await writePdfFile(file, fileName);
    proposal.proposalName = proposalName;
    proposal.fileName = fileName;
    proposal.shortDescription = shortDescription;
    proposal.threadLink = threadLink;
    await proposal.save();
  } catch (e) {
    ctx.throw(500, e);
  }
  ctx.status = 200;
};

module.exports = {
  addNewDraft,
  getMyProposals,
  deleteDraft,
  editDraft,
};
