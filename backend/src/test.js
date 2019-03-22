import { solve } from './aho-corasick';
import { calculateTFProbabilities, transformPFMtoPWM } from './calculations';
import matrix from '../testmatrix.json';
import sequence from '../teststring.json';

const testSpeedAho = (s, mat) => {
  const start = new Date();
  solve(s, mat);
  const end = new Date();
  return end.getTime() - start.getTime();
};

const testSpeedNor = (s, mat) => {
  const start = new Date();
  calculateTFProbabilities(s, mat);
  const end = new Date();
  return end.getTime() - start.getTime();
};

const m = transformPFMtoPWM(matrix.m[0]);

const normal = [];

const aho = [];


const test = () => {
  for (let i = 13; i >= 4; i -= 1) {
    console.log(m.A.length);
    const n = testSpeedNor(sequence.sequence, m);
    console.log(`Test normal: ${n}`);
    const a = testSpeedAho(sequence.sequence, m);
    console.log(`Test aho: ${a}`);
    normal.push(n);
    aho.push(a);
    Object.keys(m).forEach((x) => {
      m[x].pop();
    });
  }
};
console.log('runs');
test();

normal.forEach(x => console.log(x));
aho.forEach(x => console.log(x));
