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

getLists(`../inputs/day2-input.txt`)
  .then(data => console.log(getListDistances(data.left, data.right)))
  .catch(err => console.error(err));

