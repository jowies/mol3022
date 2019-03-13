import axios from 'axios';
import Koa from 'koa';
import Router from 'koa-router';

import { calculateTFProbabilities, transformPFMtoPWM } from './calculations';

const app = new Koa();

const router = new Router();

let matrices = [];

const getMatrices = async () => {
  const response = (await axios.get('http://jaspar.genereg.net/api/v1/matrix?format=json&page_size=2404'));
  matrices = response.data.results;
  console.log(matrices[0]);
};

const getMatrix = async (id) => {
  const matrix = await axios.get(`http://jaspar.genereg.net/api/v1/matrix/${id}?format=json`);
  return matrix.data;
};

router.get('/matrices', async (ctx) => {
  console.log('132');
  ctx.body = matrices;
});

const getMatricesAsPWD = async (matricesQuery) => {
  console.log(matricesQuery);
  const matrixIDs = matricesQuery.split(',');
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

router.get('/calculate', async (ctx) => {
  const sequencesQuery = ctx.query.sequences;
  const matricesQuery = ctx.query.matrices;

  const PWMs = await getMatricesAsPWD(matricesQuery);
  const sequences = sequencesQuery.split(',');

  const probabilitySequences = sequences.map(seq => ({ sequence: seq, prob: getProbabilitySequence(seq, PWMs) }));
  ctx.body = { probabilitySequences, matrices: PWMs.map(x => x.info) };
});

app.use(router.routes());

getMatrices();

app.listen(3000);
