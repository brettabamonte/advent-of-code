const fs = require('node:fs/promises');

class TreeNode {
    constructor(val, operator = null) {
        this.exp = { val: val, operator: operator}; 
        this.left = null;
        this.right = null; 
    }
}

class Queue {
  constructor(vals = []) {
    this.vals = vals;
  }

  Enqueue(val) {
    this.vals.push(val);
  }

  Dequeue() {
    let val = this.vals[0];
    this.vals = this.vals.slice(1, this.vals.length);
    return val;
  }

  Length() {
    return this.vals.length;
  }
}

const Operators = Object.freeze({
  add: '+',
  multiply: '*',
});

async function readFile(filePath) {
  try {
    return await fs.readFile(filePath, { encoding: 'utf-8' });
  } catch(e) {
    throw e;
  }
}

function parseInput(data) {
  let rows = data.split('\n');
  rows = rows.slice(0, rows.length - 1);
  let equations = [];
  rows.forEach(row => {
    const data = row.split(':');
    const target = parseInt(data[0]);
    let operands = [...data[1].matchAll(/\d+/g)];
    operands = operands.map(operand => parseInt(operand));
    equations.push({
      target: target,
      operands: operands
    });
  });
  return equations;
}

function buildTree(operands) {
  let nodes = new Queue();
  let root = new TreeNode(operands[0]);
  nodes.Enqueue(root);
  for(var i = 1; i < operands.length; i++) {
    let levelSize = nodes.Length();
    while(levelSize > 0) {
      let node = nodes.Dequeue();
      node.left = new TreeNode(operands[i], Operators.add);
      node.right = new TreeNode(operands[i], Operators.multiply);
      levelSize -= 1;
      nodes.Enqueue(node.left);
      nodes.Enqueue(node.right);
    }
  }
  return root;
}

function treeMeetsTarget(node, target, cur) {
  if(node == null) return false;
  if(node.left == null && node.right == null) {
    switch(node.exp.operator) {
      case Operators.add:
        if(node.exp.val + cur == target) return true;
        else return false;
      case Operators.multiply:
        if(node.exp.val * cur == target) return true;
        else return false;
      default:
        return node.exp.val == target;
    }
  }

  let update;
  switch(node.exp.operator) {
    case Operators.add:
      update = cur + node.exp.val;
      break;
    case Operators.multiply:
      update = cur * node.exp.val;
      break;
    default:
      update = node.exp.val;
  }

  return treeMeetsTarget(node.left, target, update) || treeMeetsTarget(node.right, target, update);
}

readFile('../inputs/day07-input.txt')
  .then(data => {
    const input = parseInput(data);
    let equations = [];
    input.forEach(equation => {
      equations.push({
        target: equation.target,
        tree: buildTree(equation.operands)
      })
    });
    return equations;
  })
  .then(equations => {
    return equations.reduce((sum, equation) => {
        if(treeMeetsTarget(equation.tree, equation.target, equation.tree.exp.val)) return sum + equation.target;
        else return sum;
      }, 0);
  })
  .then(calibrationResult => console.log(calibrationResult))
  .catch(err => console.error(err));
