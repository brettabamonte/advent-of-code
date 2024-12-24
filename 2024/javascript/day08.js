const fs = require('node:fs/promises');

class AOCMap {
  constructor(map, antennas) {
    this.map = map;
    this.antennas = antennas;
    this.antinodes = new Set();
  }

  GetAntennas() {
    return this.antennas;
  }

  AddAntinode(row, col) {
    this.antinodes.add([row,col])
  }

  GetAntinodes() {
    return this.antinodes;
  }

  AntinodesLength() {
    return this.antinodes.size;
  }

  IsInbounds(row, col) {
    return ((row >= 0 && row < this.map.length) && (col >= 0 && col < this.map[row].length))
  }

  GetChar(row, col) {
    return this.map[row][col];
  }

}

async function readFile(filePath) {
  try {
    return await fs.readFile(filePath, { encoding: 'utf-8' });
  } catch(e) {
    throw e;
  }
}

function buildMap(data) {
  let rows = data.split('\n');
  rows = rows.slice(0, rows.length - 1); //remove empty row
  let mapData = new Array(rows.length);
  let antennas = new Map();
  for(let i = 0; i < mapData.length; i++) {
    mapData[i] = new Array(rows[i].length);
    for(let j = 0; j < mapData[i].length; j++) {
      mapData[i][j] = rows[i][j];

      if(isAntenna(rows[i][j])) {
        if(antennas.has(rows[i][j])) {
          antennas.set(rows[i][j], antennas.get(rows[i][j]).add([i,j]))
        } else {
          antennas.set(rows[i][j], new Set([[i,j]]));
        }
      }
    }
  }

  let map = new AOCMap(mapData, antennas);
  return map;
}

function isAntenna(char) {
  const re = /(\d|[a-z]|[A-Z])/;
  return re.test(char);
}

//Finds unique antinodes....not every one.
function setUniqueAntinodes(map) {
  map.GetAntennas().forEach(antenna => {
    let antennaArr = [...antenna];
    for(let i = 0; i < antennaArr.length - 1; i++) {
      for(let j = i + 1; j < antennaArr.length; j++) {
        let rowSlope = antennaArr[j][0] - antennaArr[i][0];
        let colSlope = antennaArr[j][1] - antennaArr[i][1];
        let positiveAntinodeRow = antennaArr[j][0] + rowSlope; 
        let positiveAntinodeCol = antennaArr[j][1] + colSlope; 
        let negativeAntinodeRow = antennaArr[i][0] - rowSlope; 
        let negativeAntinodeCol = antennaArr[i][1] - colSlope; 
        if(map.IsInbounds(positiveAntinodeRow, positiveAntinodeCol) && !isAntenna(map.GetChar(positiveAntinodeRow, positiveAntinodeCol))) {
          map.AddAntinode(positiveAntinodeRow, positiveAntinodeCol); 
        }
        if(map.IsInbounds(negativeAntinodeRow, negativeAntinodeCol) && !isAntenna(map.GetChar(negativeAntinodeRow, negativeAntinodeCol))) {
          map.AddAntinode(negativeAntinodeRow, negativeAntinodeCol);
        }
      }
    }
  });
}

readFile('../inputs/day08-input.txt')
  .then(data => buildMap(data))
  .then(map => {
      setUniqueAntinodes(map)
      console.log(map.AntinodesLength());
  })
  .catch(err => console.error(err));
