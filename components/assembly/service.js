const pdfParse = require('pdf-parse');
const base64 = require('base64topdf');
const fs = require('fs');
const { proposals: ProposalsModel } = require('../../models');

function WritePdfFileException(message) {
  this.message = message;
  this.name = 'Custom exception';
}

const writePdfFile = async (file, fileName) => {
  const filePath = `./proposals/${fileName}.pdf`;
  const buf = () => Buffer.from(filePath, 'base64');
  if (buf) {
    await base64.base64Decode(file.slice(28), filePath);
    return (filePath);
  }
  throw new WritePdfFileException('Write file is fail');
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

module.exports = {
  addNewDraft,
  getMyProposals,
};
