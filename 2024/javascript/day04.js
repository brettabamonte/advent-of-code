const fs = require('node:fs/promises');

const Direction = Object.freeze({
  ForwardHorizontal: {
    dir: 'forward-horizontal',
  },
  BackwardHorizontal: {
    dir: 'backward-horizontal',
  },
  UpwardVertical: {
    dir: 'upward-vertical',
  },
  DownwardVertical: {
    dir: 'downward-vertical',
  },
  RightUpwardDiagonal: {
    dir: 'right-upward-diagonal',
  },
  RightDownwardDiagonal: {
    dir: 'right-downward-diagonal',
  },
  LeftUpwardDiagonal: {
    dir: 'left-upward-diagonal',
  },
  LeftDownwardDiagonal: {
    dir: 'left-downward-diagonal',
  }
});

async function readFile(filePath) {
  try {
   return await fs.readFile(filePath, { encoding: 'utf-8' });
  } catch(e) {
    throw e;
  }
}

async function createMatrix() {
  try {
    const data = await readFile('../inputs/day04-input.txt');
    const rows = data.split('\n');
    let matrix = new Array(rows.length);
    rows.forEach((row, i) => {
      matrix[i] = new Array(row.length);
      for(let j = 0; j < row.length; j++) {
        matrix[i][j] = row[j];
      }
    });
    return matrix;
  } catch(e) {
    throw e;
  }
}

async function countXmas() {
  try {
    const matrix = await createMatrix();
    let count = 0;
    for(let row = 0; row < matrix.length; row++) {
      for(let col = 0; col < matrix[row].length; col++) {
        if(matrix[row][col] == 'X') {
          count += isXmas(row, col, matrix, Direction.ForwardHorizontal.dir, "") ? 1 : 0;
          count += isXmas(row, col, matrix, Direction.BackwardHorizontal.dir, "") ? 1 : 0;
          count += isXmas(row, col, matrix, Direction.UpwardVertical.dir, "") ? 1 : 0;
          count += isXmas(row, col, matrix, Direction.DownwardVertical.dir, "") ? 1 : 0;
          count += isXmas(row, col, matrix, Direction.RightUpwardDiagonal.dir, "") ? 1 : 0;
          count += isXmas(row, col, matrix, Direction.RightDownwardDiagonal.dir, "") ? 1 : 0;
          count += isXmas(row, col, matrix, Direction.LeftUpwardDiagonal.dir, "") ? 1 : 0;
          count += isXmas(row, col, matrix, Direction.LeftDownwardDiagonal.dir, "") ? 1 : 0;
        }
      }
    }
    return count;
  } catch(e) {
    throw e;
  }
}

function isXmas(curRow, curCol, matrix, direction, str) {
  if (curRow >= matrix.length || curRow < 0) return false;
  if (curCol >= matrix[curRow].length || curCol < 0) return false;

  if(str.length == 1 && str[0] != "X") return false;
  if(str.length == 2 && str[1] != "M") return false;
  if(str.length == 3 && str[2] != "A") return false;
  if(str.length == 4 && str[3] != "S") return false;

  if(str.length == 3 && matrix[curRow][curCol] == 'S') return true;

  switch(direction) {
    case Direction.ForwardHorizontal.dir:
      str += matrix[curRow][curCol];
      return isXmas(curRow, curCol + 1, matrix, direction, str);
    case Direction.BackwardHorizontal.dir:
      str += matrix[curRow][curCol];
      return isXmas(curRow, curCol - 1, matrix, direction, str);
    case Direction.UpwardVertical.dir:
      str += matrix[curRow][curCol];
      return isXmas(curRow - 1, curCol, matrix, direction, str);
    case Direction.DownwardVertical.dir:
      str += matrix[curRow][curCol];
      return isXmas(curRow + 1, curCol, matrix, direction, str);
    case Direction.RightUpwardDiagonal.dir:
      str += matrix[curRow][curCol];
      return isXmas(curRow - 1, curCol + 1, matrix, direction, str);
    case Direction.RightDownwardDiagonal.dir:
      str += matrix[curRow][curCol];
      return isXmas(curRow + 1, curCol + 1, matrix, direction, str);
    case Direction.LeftUpwardDiagonal.dir:
      str += matrix[curRow][curCol];
      return isXmas(curRow - 1, curCol - 1, matrix, direction, str);
    case Direction.LeftDownwardDiagonal.dir:
      str += matrix[curRow][curCol];
      return isXmas(curRow + 1, curCol - 1, matrix, direction, str);
    default:
      return false;
  }
}

countXmas()
  .then(count => console.log(count))
  .catch(err => console.error(err));
