const fs = require('node:fs/promises');

//Assuming lists are always equal length
function getListDistances(list1, list2) {
  var total = 0;
  list1.sort();
  list2.sort();
  for(let i = 0, j = 0; i < list1.length; i++, j++) {
    total += Math.abs(list2[j] - list1[i]);
  }
  return total;
}

function getSimilarityScore(list1, list2) {
  var map = new Map();
  var score = 0;

  for(let i = 0; i < list1.length; i++) {
    if(map.has(list1[i])) {
      map.set(list1[i], map.get(list1[i]) + list2.reduce((acc, cur) => acc + (cur == list1[i] ? cur : 0), 0));
    } else {
      map.set(list1[i], list2.reduce((acc, cur) => acc + (cur == list1[i] ? cur : 0), 0));
    }
  }

  map.forEach(value => score += value);
  return score;
}

async function getLists(filePath) {
  try {
    const data = await fs.readFile(filePath, { encoding: 'utf-8' });
    const rows = data.split('\n');
    let leftList = [];
    let rightList = [];
    rows.map(row => {
      let matches = [...row.matchAll(/\d+/g)];
      let leftNum = Number.parseInt(matches[0]);
      let rightNum = Number.parseInt(matches[1]);

      if (!Number.isNaN(leftNum)) leftList.push(leftNum);
      if (!Number.isNaN(rightNum)) rightList.push(rightNum);
    });
    return {
      left: leftList,
      right: rightList
    }
  } catch(e) {
      throw e;
  }
}

getLists(`../inputs/day1-input.txt`)
  .then(({ left, right }) => {
    console.log(getListDistances(left, right))
    console.log(getSimilarityScore(left, right))
  })
  .catch(err => console.error(err));
