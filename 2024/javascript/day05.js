const fs = require('node:fs/promises');

async function readFile(filePath) {
  try {
    return await fs.readFile(filePath, { encoding: 'utf-8' }); 
  } catch(e) {
    throw e;
  }
}

function splitSections(data) {
  const splitData = data.split(/\n\n/);
  return {
    pageOrderingRules: splitData[0],
    pageNumberUpdates: splitData[1]
  };
}

function buildUpdateRules(rules) {
  let map = new Map();
  const rulesArr = rules.split('\n');
  rulesArr.forEach(rule => {
    let order = rule.split('|');
    let before = Number.parseInt(order[0]);
    let after = Number.parseInt(order[1]);
    
    if(map.has(before)) {
      map.set(before, map.get(before).add(after));
    } else {
      map.set(before, new Set([after]));
    }
  });
  return map;
}

function getValidUpdates(updateRows, updateRules) {
  let validUpdates = [];
  let updates = updateRows.split('\n');
  updates = updates.slice(0, updates.length - 1); //remove empty row
  updates.forEach(row => {
    let update = row.split(',');
    update = update.map(element => parseInt(element));
    for(var i = update.length - 1; i >= 1; i--) {
      if(!validUpdatePosition(update[i], updateRules, update.slice(0, i))) break;
    }
    if(i == 0) validUpdates.push(update);
  })
  return validUpdates;
}

function validUpdatePosition(pageNum, pageNumRules, precedingPages) {
  if(pageNumRules.has(pageNum)) {
      for(let i = 0; i < precedingPages.length; i++) {
        if(pageNumRules.get(pageNum).has(precedingPages[i])) return false;
      }
  }
  return true;
}

function sumMiddleElements(validUpdates) {
  return validUpdates.reduce((sum, update) => {
    return sum + Number.parseInt(update[(update.length - 1) / 2]);
  }, 0)
}

readFile('../inputs/day05-input.txt')
  .then(data => {
    const { pageOrderingRules, pageNumberUpdates } = splitSections(data);
    const updateRules = buildUpdateRules(pageOrderingRules);
    const validUpdates = getValidUpdates(pageNumberUpdates, updateRules);
    console.log(sumMiddleElements(validUpdates));
  })
  .catch(err => console.error(err));
