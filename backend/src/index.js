import axios from 'axios';
import Koa from 'koa';
import Router from 'koa-router';
import parser from 'koa-bodyparser';
import { solveFor } from './aho-corasick';

import { calculateTFProbabilities, transformPFMtoPWM } from './calculations';

const app = new Koa();
app.use(parser());

const router = new Router();

let matrices = [];

const getMatrices = async () => {
  const response = (await axios.get('http://jaspar.genereg.net/api/v1/matrix?format=json&page_size=2404'));
  matrices = response.data.results;
};

const getMatrix = async (id) => {
  const matrix = await axios.get(`http://jaspar.genereg.net/api/v1/matrix/${id}?format=json`);
  return matrix.data;
};

router.get('/matrices', async (ctx) => {
  ctx.body = matrices;
});

const getMatricesAsPWD = async (matricesQuery) => {
  const matrixIDs = matricesQuery;
  const requestedMatrices = await Promise.all(matrixIDs.map(async id => getMatrix(id)));
  return requestedMatrices.map((matrix, i) => (
    { pwm: transformPFMtoPWM(matrix.pfm), info: requestedMatrices[i] }
  ));
};

const getProbabilitySequence = (sequence, PWMs) => PWMs
  .map(matrix => ({
    sequence: calculateTFProbabilities(sequence, matrix.pwm),
    id: matrix.info.matrix_id,
  }));

router.post('/calculate', async (ctx) => {
  const sequencesQuery = ctx.request.body.sequences;
  const matricesQuery = ctx.request.body.matrices;
  const { type } = ctx.request.body;

  const PWMs = await getMatricesAsPWD(matricesQuery);
  const sequences = sequencesQuery;
  if (type === 'na') {
    const probabilitySequences = sequences
      .map(seq => ({ sequence: seq, prob: getProbabilitySequence(seq, PWMs) }));
    ctx.body = { probabilitySequences, matrices: PWMs.map(x => x.info) };
  } else if (type === 'ac') {
    ctx.body = { startingPoints: solveFor(sequences, PWMs), matrices: PWMs.map(x => x.info) };
  } else {
    const probabilitySequences = sequences
      .map(seq => ({ sequence: seq, prob: getProbabilitySequence(seq, PWMs) }));
    ctx.body = {
      probabilitySequences,
      startingPoints: solveFor(sequences, PWMs),
      matrices: PWMs.map(x => x.info),
    };
  }
});

app.use(router.routes());

getMatrices();

app.listen(3000);
