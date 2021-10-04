const pdfParse = require('pdf-parse');
const base64 = require('base64topdf');
const fs = require('fs');
const crypto = require('crypto');
const { Op, where } = require('sequelize');
const { proposals: ProposalsModel } = require('../../models');

function WritePdfFileException(message) {
  this.message = message;
  this.name = 'Custom exception';
}

const numToBuf = (num) => {
  const b = new ArrayBuffer(4);
  new DataView(b).setUint32(0, num);
  const arr = Array.from(new Uint8Array(b));
  return Buffer.from(arr);
};

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

const getProposalFileHash = async (fileName, timeStamp) => {
  const filePath = `./proposals/${fileName}.pdf`;
  const file = fs.readFileSync(filePath);
  const data = await pdfParse(file);
  const hash = crypto.createHash('sha256');
  hash.update(data.text);
  hash.update(numToBuf(timeStamp));
  return hash.digest('hex');
};

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
      draftType,
      proposalStatus,
    } = await ctx.request.body;

    await writePdfFile(file, fileName);

    const docHash = await getProposalFileHash(fileName, createdDate);

    await ProposalsModel.create({
      userId,
      proposalStatus,
      proposalName,
      fileName,
      shortDescription,
      threadLink,
      createdDate,
      requiredAmountLlm,
      currentLlm,
      votingHourLeft,
      docHash,
      draftType,
    });
  } catch (e) {
    ctx.throw(500, e);
  }
  ctx.status = 200;
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

const verifyProposalHash = async (ctx) => {
  const proposal = await getProposal(ctx.params.id);
  const newHash = await getProposalFileHash(proposal.fileName, proposal.createdDate);

  console.log('proposal.docHash ', proposal.docHash);
  console.log('newHash ', newHash);

  if (proposal.docHash !== newHash) {
    ctx.throw(500, 'Hashes not identical');
  }

  ctx.body = newHash;
};

const calcHash = async (ctx) => {
  const proposal = await getProposal(ctx.params.id);
  const hash = await getProposalFileHash(proposal.fileName, proposal.createdDate);

  console.log('proposal.docHash ', proposal.docHash);
  console.log('newHash ', hash);

  if (proposal.docHash !== hash) {
    ctx.throw(500, 'Hashes not identical');
  }

  ctx.body = { hash, proposalType: proposal.draftType };
};

const getMyProposals = async (ctx) => {
  const { userId } = ctx.request.body;
  ctx.body = await ProposalsModel.findAll({
    where: {
      userId,
    },
  });
};

const getProposalsByHash = async (ctx) => {
  ctx.body = await ProposalsModel.findAll({
    where: {
      docHash: ctx.request.body.hashes,
    },
  });
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
      draftType,
      requiredAmountLlm,
    } = await ctx.request.body;
    removeProposalFile(ctx, proposal.fileName);

    await writePdfFile(file, fileName);

    const docHash = await getProposalFileHash(fileName, proposal.createdDate);

    proposal.proposalName = proposalName;
    proposal.fileName = fileName;
    proposal.shortDescription = shortDescription;
    proposal.threadLink = threadLink;
    proposal.docHash = docHash;
    proposal.draftType = draftType;
    proposal.requiredAmountLlm = requiredAmountLlm;

    await proposal.save();
  } catch (e) {
    ctx.throw(500, e);
  }
  ctx.status = 200;
};

const updateStatusProposal = async (ctx) => {
  try {
    const {
      hash,
      status,
      requiredAmountLlm,
      currentLlm,
      votingHourLeft,
      nodeIdProposel,
      draftType,
    } = ctx.request.body;

    await ProposalsModel.update({
      proposalStatus: status,
      requiredAmountLlm,
      currentLlm,
      votingHourLeft,
      nodeIdProposel,
      draftType,
    },
    {
      where: {
        docHash: hash,
      },
    });
    ctx.status = 200;
  } catch (e) {
    ctx.throw(500, e);
  }
};

const getProposalsNotDraft = async () => ({
  proposals: await ProposalsModel.findAll({
    where: {
      [Op.not]: [
        {
          proposalStatus: 'Draft',
        },
      ],
    },
  }),
});

const updateAllProposals = async (ctx) => {
  try {
    const { hashesAllProposals } = ctx.request.body;
    if (hashesAllProposals === 'IsEmpty') {
      ctx.status = 200;
      return;
    }
    await hashesAllProposals.map(async (proposal) => {
      await ProposalsModel.update({
        proposalStatus: proposal.state,
      },
      {
        where: {
          docHash: proposal.docHash,
        },
      }).catch((e) => console.log('Error in updateAllProposals', e));
    });
    ctx.body = await getProposalsNotDraft();
  } catch (e) {
    ctx.throw(500, e);
  }
};

const getHashesProposalsNotDraft = async (ctx) => {
  ctx.body = {
    hashesNotDraft: await ProposalsModel.findAll({
      attributes: ['docHash'],
      where: {
        [Op.not]: [
          {
            proposalStatus: ['Draft', 'Declined'],
          },
        ],
      },
    }),
  };
};

const updatePowerProposal = async (ctx) => {
  try {
    const { docHash, votePower } = ctx.request.body;
    if (docHash === 'IsEmpty') {
      ctx.status = 200;
      return;
    }
    await ProposalsModel.update({
      currentLlm: votePower,
    },
    {
      where: {
        docHash,
      },
    }).catch((e) => console.log('Error in updateAllProposals', e));
    ctx.body = await getProposalsNotDraft();
  } catch (e) {
    ctx.throw(500, e);
  }
};

const getProposalsByStatusAndType = async (ctx) => {
  try {
    const { status, type } = ctx.request.body;
    ctx.body = {
      proposals: await ProposalsModel.findAll({
        where: {
          [Op.and]: [{ proposalStatus: status }, { draftType: type }],
        },
      }),
    };
  } catch (e) {
    ctx.throw(500, e);
  }
};

const getAllProposalsApproved = async (ctx) => {
  try {
    ctx.body = {
      proposals: await ProposalsModel.findAll({
        where: {
          proposalStatus: 'Approved',
        },
      }),
    };
  } catch (e) {
    ctx.throw(500, e);
  }
};

module.exports = {
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
};
