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
  word.forEach((w) => {
    assignAndAdd(ac.W, state.toString(), w);
    state = addIterableAndReturn(ac.G, state, w);
  });
  assignAndAdd(ac.O, state.toString(), word.join(''));
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
  console.log(state);
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
  const split = text.split('');
  for (let i = 0; i < text.length; ++i) {
    const t = text[i];
    while (state && !isInG(state, t, ac.G)) {
      state = ac.F[state.toString()];
    }
    state = isInG(state, t, ac.G) ? ac.G[`${state},${t}`] : 0;
    if (ac.O[state.toString()] && ac.O[state.toString()].length !== 0) {
      console.log(i);
      console.log(ac.O[state.toString()]);
    }
  }
};

const AC = ahoCorasick();
addWord('bar'.split(''), AC);
addWord('ara'.split(''), AC);
addWord('bara'.split(''), AC);
addWord('barbara'.split(''), AC);
console.log(AC);
buildFSM(AC);

console.log(AC);

search('barbarian barbara said: barabum', AC);
