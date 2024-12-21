const fs = require('node:fs/promises');

async function readFile(filePath) {
  try {
    return await fs.readFile(filePath, { encoding: 'utf-8' });
  } catch(e) {
    throw e;
  }
}

function buildMap(input) {
  let rows = input.split('\n');
  rows = rows.slice(0, rows.length - 1);
  let matrix = new Array(rows.length);
  rows.forEach((row, i) => {
    matrix[i] = new Array(row.length);
    for(let j = 0; j < row.length; j++) matrix[i][j] = row[j];
  });
  return matrix;
}

function game(map) {
  var moveCounter = 1; //starts at one because we are including starting position.
  var visitedPositions = new Set();
  const direction = Object.freeze({
    up: { row: -1, col: 0 },
    down: { row: 1, col: 0 },
    right: { row: 0, col: 1 },
    left: { row: 0, col: -1 },
  })
  let guardDirection = direction.up;
  let guardPosition = { row: 0, col: 0 };
  
  let playLoop = () => {
    findGuard();
    visitedPositions.add(`${guardPosition.row},${guardPosition.col}`);
    while(!isGameOver()) {
      moveGuard();
      if(!visitedPositions.has(`${guardPosition.row},${guardPosition.col}`)) {
        visitedPositions.add(`${guardPosition.row},${guardPosition.col}`);
        moveCounter++;
      }
    }
  }

  const findGuard = () => {
    for(let row = 0; row < map.length; row++) {
      for(let col = 0; col < map[row].length; col++) {
        if(map[row][col] == "^") {
          guardPosition.row = row;
          guardPosition.col = col;
          return;
        }
      }
    }
  }

  const moveGuard = () => {
    while(map[guardPosition.row + guardDirection.row][guardPosition.col + guardDirection.col] == "#") {
      if(guardDirection == direction.up) guardDirection = direction.right;
      else if(guardDirection == direction.down) guardDirection = direction.left;
      else if(guardDirection == direction.left) guardDirection = direction.up;
      else if(guardDirection == direction.right) guardDirection = direction.down;
    }
    switch(guardDirection) {
      case direction.up: 
          guardPosition.row += direction.up.row;
          guardPosition.col += direction.up.col;
          break;
      case direction.down: 
          guardPosition.row += direction.down.row;
          guardPosition.col += direction.down.col;
          break;
      case direction.left: 
          guardPosition.row += direction.left.row;
          guardPosition.col += direction.left.col;
          break;
      case direction.right: 
          guardPosition.row += direction.right.row;
          guardPosition.col += direction.right.col;
          break;
    }
  }
  
  const isGameOver = () => {
    if(guardPosition.col >= map[guardPosition.row].length - 1 || guardPosition.col <= 0) return true;
    else if(guardPosition.row >= map.length - 1 || guardPosition.row <= 0) return true;
    return false;
  }

  return {
    play: () => playLoop(),
    numberOfMoves: () => moveCounter
  }
}

readFile('../inputs/day06-input.txt')
  .then(data => {
    const map = buildMap(data);
    const g = game(map);
    g.play();
    console.log(g.numberOfMoves());
  })
  .catch(err => console.error(err));
