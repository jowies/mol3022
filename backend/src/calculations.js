const pseudoCountedProbability = (value, total) => ((value + 1 * 0.25)
  / (total + 1));


const calculateWeighted = (prob, bg) => Math.log2(prob / bg);

const transformPFMtoPWM = (matrix, bg = 0.25) => {
  const keys = Object.keys(matrix);
  const PWM = { ...{}, ...matrix };
  for (let i = 0; i < matrix[keys[0]].length; i += 1) {
    let total = 0;
    keys.forEach((x) => { total += matrix[x][i]; });
    keys.forEach((x) => {
      PWM[x][i] = calculateWeighted(pseudoCountedProbability(matrix[x][i], total), bg);
    });
  }
  return PWM;
};

const calculateTFProbabilities = (sequence, matrix) => {
  const matrixLength = matrix.A.length;
  const sequenceLength = sequence.length;
  const sequenceProbability = [];
  for (let i = 0; i < sequenceLength - matrixLength; i += 1) {
    let totalProb = 0;
    for (let j = 0; j < matrixLength; j += 1) {
      totalProb += matrix[sequence[i + j].toUpperCase()][j];
    }
    sequenceProbability[i] = totalProb;
  }
  return sequenceProbability;
};


export { calculateTFProbabilities, transformPFMtoPWM };
