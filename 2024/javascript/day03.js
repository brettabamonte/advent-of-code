const fs = require('node:fs/promises');

async function getValidMul() {
  try {
    const data = await readFile('../inputs/day03-input.txt');
    const matches = [...data.matchAll(/mul\(\d{1,3},\d{1,3}\)/g)];
    let total = matches.reduce((sum, match) => {
      let operands = [...match[0].matchAll(/\d{1,3}/g)];
      let leftOperand = Number.parseInt(operands[0]);
      let rightOperand = Number.parseInt(operands[1]);
      return sum + (leftOperand * rightOperand);
    }, 0)
    return total;
  } catch(e) {
    throw e;
  }
}

async function readFile(filePath) {
  try {
    return await fs.readFile(filePath, { encoding: 'utf-8' })
  } catch(e) {
    throw e;
  }
}

getValidMul()
  .then(total => console.log(total))
  .catch(err => console.error(err))
