import axios from 'axios';
import Koa from 'koa';
import Router from 'koa-router';
import parser from 'koa-bodyparser';
import cors from '@koa/cors';

import { solveFor } from './aho-corasick';

import { calculateTFProbabilities, transformPFMtoPWM } from './calculations';

const app = new Koa();
app.use(parser());
app.use(cors());

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
    positions: calculateTFProbabilities(sequence, matrix.pwm),
    id: matrix.info.matrix_id,
  }));

router.post('/calculate', async (ctx) => {
  const sequencesQuery = ctx.request.body.sequences;
  const matricesQuery = ctx.request.body.matrices;
  const { type } = ctx.request.body;
  // const PWMs = await getMatricesAsPWD(matricesQuery);
  const PWMs = [{
    pwm: transformPFMtoPWM({
      A: [1036, 1036, 1036, 0, 620, 198, 0, 0, 0],
      C: [0, 0, 0, 495, 0, 185, 1036, 0, 0],
      G: [0, 0, 0, 0, 416, 402, 0, 0, 1036],
      T: [0, 0, 0, 541, 0, 251, 0, 1036, 0],
    }),
    info: {
      matrix_id: 'oiasjd',
    },
  }];
  const sequences = sequencesQuery;
  if (type === 'na') {
    const na = sequences
      .map(seq => ({ sequence: seq, result: getProbabilitySequence(seq, PWMs) }));
    ctx.body = { na, matrices: PWMs.map(x => x.info) };
  } else if (type === 'ac') {
    ctx.body = { ac: solveFor(sequences, PWMs), result: PWMs.map(x => x.info) };
  } else {
    const na = sequences
      .map(seq => ({ sequence: seq, result: getProbabilitySequence(seq, PWMs) }));
    ctx.body = {
      na,
      ac: solveFor(sequences, PWMs),
      result: PWMs.map(x => x.info),
    };
  }
});

app.use(router.routes());

getMatrices();

app.listen(3000);
