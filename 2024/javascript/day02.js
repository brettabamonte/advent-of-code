const fs = require('node:fs/promises');

const Slope = Object.freeze({
  increasing: "increasing",
  decreasing: "decreasing"
})

function numberOfSafeReports(reports) {
  var total = 0;
  reports.map(report => {
    let slope = '';
    for(let i = 0; i < report.length; i++) {
      //Determine slope at 2nd element.
      if(i == 1) {
        slope = determineSlope(report[i - 1], report[i]);
        if(slope === undefined || !isLevelSafe(slope, report[i - 1], report[i])) break;
      } else if(i != 0 && i + 1 != report.length) { // break out of loop when a level isn't safe
        if(!isLevelSafe(slope, report[i - 1], report[i])) break;
      } else if(i + 1 == report.length) { //if we are on last level and it's safe. It means the whole report is safe.
        if(isLevelSafe(slope, report[i - 1], report[i])) total += 1;
      }
    }
  });
  return total;
}

//Helper function to determine slope. Returns undefined if 1st two levels are ==.
function determineSlope(first, second) {
  if(first < second) return Slope.increasing;
  else if(first > second) return Slope.decreasing;
  else return undefined;
}

//Helper function to determine if level is safe
function isLevelSafe(slope, left, cur) {
  //Check slope
  if(slope == Slope.decreasing && left <= cur) return false; 
  if(slope == Slope.increasing && left >= cur) return false;
  if(Math.abs(cur - left) < 1 || Math.abs(cur - left) > 3) return false;
  return true;
}

async function getReports(filePath) {
  try {
    const data = await fs.readFile(filePath, { encoding: 'utf-8' });
    const rawReportData = data.split('\n');
    let reports = [];
    rawReportData.map(report => {
      const matches = [...report.matchAll(/\d{1,2}/g)];
      let levels = [];
      matches.map((_, i) => levels.push(Number.parseInt(matches[i]))); 
      reports.push(levels);
    });
    return reports;
  } catch(e) {
    throw e;
  }
}

getReports('../inputs/day02-input.txt')
  .then(reports => console.log(numberOfSafeReports(reports)))
  .catch(err => console.error(err));
