const pdfParse = require('pdf-parse');
const base64 = require('base64topdf');
const fs = require('fs');
const { proposals: ProposalsModel } = require('../../models');

const writePdfFile = (ctx) => new Promise((resolve, reject) => {
  const { file, fileName } = ctx.request.body;
  const filePath = `./proposals/${fileName}.pdf`;
  const buf = () => Buffer.from(filePath, 'base64');
  if (buf) {
    base64.base64Decode(file.slice(28), filePath);
    resolve(filePath);
  } else {
    reject();
  }
});

const writeDataToDb = (filePath) => new Promise((resolve, reject) => {
  const dataBuffer = fs.readFileSync(filePath);
  if (!dataBuffer) reject();

  pdfParse(dataBuffer).then((data) => {
    resolve(data.text);
  });
});

const fetchTextFields = async (ctx) => {
  await writePdfFile(ctx).catch((error) => console.log(error));

  ctx.body = {  };
};

module.exports = {
  fetchTextFields,
  writePdfFile,
};
