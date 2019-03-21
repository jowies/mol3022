import Deque from 'collections/deque';

const ahoCorasick = () => ({
  G: {},
  W: {},
  F: {},
  O: {},
});

/* eslint-disable no-param-reassign */
const assignAndAdd = (dict, key, value) => {
  if (dict[key]) {
    if (dict[key].indexOf(value) === -1) {
      dict[key].push(value);
    }
  } else {
    dict[key] = [value];
  }
};

const addIterableAndReturn = (dict, state, w) => {
  if (!dict[`${state},${w}`]) {
    dict[`${state},${w}`] = Object.keys(dict).length + 1;
    return dict[`${state},${w}`];
  }
  return dict[`${state},${w}`];
};

const addWord = (word, ac) => {
  let state = 0;
  for (let i = 0; i < word.length; i += 1) {
    assignAndAdd(ac.W, state.toString(), word[i]);
    state = addIterableAndReturn(ac.G, state, word[i]);
  }
  assignAndAdd(ac.O, state.toString(), { word, value: 1 });
};

const isInG = (t, w, G) => G.hasOwnProperty(`${t},${w}`);

const getKeyOfF = (F, key) => {
  if (F[key]) {
    return F[key];
  }
  return 0;
};

const getKeyOfO = (O, key) => {
  if (O[key]) {
    return O[key];
  }
  return [];
};


const construct = (state, ac, w, queue) => {
  let t = getKeyOfF(ac.F, state);

  while (t && !isInG(t, w, ac.G)) {
    t = getKeyOfF(ac.F, t);
  }
  const s = ac.G[`${state},${w}`];
  ac.F[s] = isInG(t, w, ac.G) ? ac.G[`${t},${w}`] : 0;
  ac.O[s] = getKeyOfO(ac.O, s).concat(getKeyOfO(ac.O, ac.F[s]));
  queue.push(s);
};

const buildFSM = (ac) => {
  const queue = Deque(ac.W['0'].map(w => ac.G[`${0},${w}`]));

  while (queue.one()) {
    const state = queue.shift();
    if (ac.W[state.toString()]) {
      ac.W[state.toString()].forEach((w) => {
        construct(state.toString(), ac, w, queue);
      });
    }
  }
};

const search = (text, ac) => {
  let state = 0;
  const x = [];
  for (let i = 0; i < text.length; ++i) {
    const t = text[i];
    while (state && !isInG(state, t, ac.G)) {
      state = ac.F[state.toString()];
    }
    state = isInG(state, t, ac.G) ? ac.G[`${state},${t}`] : 0;
    if (ac.O[state.toString()] && ac.O[state.toString()].length !== 0) {
      x.push({ ...{ index: i }, ...{ words: ac.O[state.toString()] } });
    }
  }
  return x;
};

const calculateMinimumThreshold = (matrix) => {
  const threshold = 0;
  const arr = [threshold];
  for (let i = matrix.A.length - 1; i >= 0; i -= 1) {
    let largest = 0;
    Object.keys(matrix).forEach((x) => {
      if (largest < matrix[x][i]) largest = matrix[x][i];
    });
    arr[matrix.A.length - i] = arr[matrix.A.length - i - 1] - largest;
  }
  return arr.reverse();
};


const hasPotential = (word, matrix, threshold) => {
  let total = 0;
  for (let i = 0; i < word.length; i += 1) {
    total = parseFloat(matrix[word[i]][i], 10) + total;
  }
  return threshold[word.length - 1] < total;
};


const generateWords = (matrix) => {
  const tempWords = [];
  const minThreshold = calculateMinimumThreshold(matrix);
  for (let i = 0; i < matrix.A.length; i += 1) {
    tempWords[i] = [];
    if (i === 0) {
      Object.keys(matrix).forEach((x) => {
        if (hasPotential(x, matrix, minThreshold)) {
          console.log('runs');
          tempWords[i].push(x);
        }
      });
    } else {
      tempWords[i] = [];
      tempWords[i - 1].forEach((x) => {
        Object.keys(matrix).forEach((z) => {
          const nword = x + z;
          if (hasPotential(nword, matrix, minThreshold)) {
            tempWords[i].push(nword);
          }
        });
      });
    }
  }
  return tempWords[tempWords.length - 1];
};

const addWords = (words, ac) => {
  words.forEach((x) => {
    addWord(x, ac);
  });
};

const solve = (sequence, matrix) => {
  const AC = ahoCorasick();
  const words = generateWords(matrix);
  addWords(words, AC);
  buildFSM(AC);
  const result = search(sequence, AC);
  return result;
};

const solveFor = (sequences, matrices) => sequences.map(s => ({
  matrices: matrices.map(x => ({ id: x.info.matrix_id, positions: solve(s, x.pwm) })),
}));

export { solveFor };
