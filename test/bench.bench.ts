import { bench, describe } from 'vitest';

import { erfc, Gaussian, ierfc } from '../src/index.js';

const g1 = new Gaussian(0, 1);
const g2 = new Gaussian(1, 2);

describe('standalone functions', () => {
  bench('erfc', () => {
    erfc(0.5);
  });
  bench('ierfc', () => {
    ierfc(0.5);
  });
});

describe('Gaussian methods', () => {
  bench('pdf', () => {
    g1.pdf(0.5);
  });
  bench('cdf', () => {
    g1.cdf(0.5);
  });
  bench('ppf', () => {
    g1.ppf(0.5);
  });
  bench('mul', () => {
    g1.mul(g2);
  });
  bench('div', () => {
    g1.div(g2);
  });
  bench('add', () => {
    g1.add(g2);
  });
  bench('sub', () => {
    g1.sub(g2);
  });
  bench('scale', () => {
    g1.scale(2);
  });
});
