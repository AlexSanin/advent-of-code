import { readFileSync } from 'node:fs'

const filename = 'input.txt'
const input = readFileSync(filename, 'utf8').split('\n\n')

function buildNodesMap(nodes) {
  return nodes.reduce((acc, item) => {
    const [root, leafs] = item.replace(/\(|\)/g, "").split('=')
    const [left, right] = leafs.split(', ')
    acc[root.trim().toLowerCase()] = { l: left.toLowerCase().trim(), r: right.toLowerCase().trim() }
    return acc
  }, {})

}

const path = input[0].split('')
const nodes = input[1].split('\n').filter((n) => n)
const target = 'zzz'
const nodesTree = buildNodesMap(nodes)

function part1(tree) {
  let steps = 0;
  let currentNode = 'aaa';

  while (true) {
    for (let i = 0; i < path.length; i++) {
      steps++;

      if (path[i] === 'L') {
        currentNode = tree[currentNode].l.trim();
      } else if (path[i] === 'R') {
        currentNode = tree[currentNode].r.trim();
      }

      if (currentNode === target) {
        return steps; // return the number of steps if target is found
      }
    }
  }
}
console.log(part1(nodesTree));

function part2(tree) {
  let steps = Array(Object.keys(tree).filter(node => node.endsWith('a')).length).fill(0);
  let currentNodes = Object.keys(tree).filter(node => node.endsWith('a'));

  while (currentNodes.some(node => !node.endsWith('z'))) {
    currentNodes.forEach((node, index) => {
      if (!node.endsWith('z')) {
        const direction = path[steps[index] % path.length] === 'L' ? 'l' : 'r';
        currentNodes[index] = tree[node][direction];
        steps[index]++;
      }
    });
  }

  return steps.reduce((acc, cur) => lcm(acc, cur), 1);
}

function lcm(a, b) {
  return (a / gcd(a, b)) * b;
}

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

console.log(part2(nodesTree));

