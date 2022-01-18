// Tests based on values from Wolfram Alpha.
import test, { ExecutionContext } from 'ava';

import { Gaussian } from '../src/index.js';

function epsilonEqual(t: ExecutionContext, actual: number, expected: number) {
  const diff = Math.abs(actual - expected);
  t.truthy(diff < 1e-5);
}

function gaussianEqual(t: ExecutionContext, actual: Gaussian, expected: Gaussian) {
  t.is(actual.mean, expected.mean);
  t.is(actual.variance, expected.variance);
}

test('should have default properties', t => {
  const d1 = new Gaussian(0, 1);
  t.is(d1.mean, 0);
  t.is(d1.variance, 1);
  t.is(d1.standardDeviation, 1);

  const d2 = new Gaussian(1, 4);
  t.is(d2.mean, 1);
  t.is(d2.variance, 4);
  t.is(d2.standardDeviation, 2);
});

test('should compute pdf', t => {
  const d = new Gaussian(0, 1);
  epsilonEqual(t, d.pdf(-2), 0.053991);
  epsilonEqual(t, d.pdf(-1), 0.241971);
  epsilonEqual(t, d.pdf(0), 0.398942);
  epsilonEqual(t, d.pdf(1), 0.241971);
  epsilonEqual(t, d.pdf(2), 0.053991);
});

test('should compute cdf', t => {
  const d = new Gaussian(0, 1);
  epsilonEqual(t, d.cdf(-1.28155), 0.1);
  epsilonEqual(t, d.cdf(-0.67449), 0.25);
  epsilonEqual(t, d.cdf(0), 0.5);
  epsilonEqual(t, d.cdf(0.67449), 0.75);
  epsilonEqual(t, d.cdf(1.28155), 0.9);
});

test('should compute ppf', t => {
  const d = new Gaussian(0, 1);
  epsilonEqual(t, d.ppf(0.1), -1.28155);
  epsilonEqual(t, d.ppf(0.25), -0.67449);
  epsilonEqual(t, d.ppf(0.5), 0);
  epsilonEqual(t, d.ppf(0.75), 0.67449);
  epsilonEqual(t, d.ppf(0.9), 1.28155);
});

test('should compute mul', t => {
  // Test normal mul.
  const d = new Gaussian(0, 1).mul(new Gaussian(0, 1));
  gaussianEqual(t, d, new Gaussian(0, 0.5));
  // Test scale.
  gaussianEqual(t, new Gaussian(1, 1).mul(2), new Gaussian(2, 4));
});

test('should compute div', t => {
  // Test normal div.
  const d = new Gaussian(1, 1).div(new Gaussian(1, 2));
  gaussianEqual(t, d, new Gaussian(1, 2));
  // Test scale.
  gaussianEqual(t, new Gaussian(1, 1).div(1 / 2), new Gaussian(2, 4));
});

test('should compute add', t => {
  gaussianEqual(t, new Gaussian(1, 1).add(new Gaussian(1, 2)), new Gaussian(2, 3));
});

test('should compute sub', t => {
  gaussianEqual(t, new Gaussian(1, 1).sub(new Gaussian(1, 2)), new Gaussian(0, 3));
});

test('should compute scale', t => {
  gaussianEqual(t, new Gaussian(1, 1).scale(2), new Gaussian(2, 4));
});

test('should rejects non-positive variances', t => {
  t.throws(() => new Gaussian(0, 0));
  t.throws(() => new Gaussian(0, -1));
});

test('ceils ppf >= 1', t => {
  const normal = new Gaussian(0, 1);
  t.is(normal.ppf(1), 141.4213562373095);
  t.is(normal.ppf(1.1), 141.4213562373095);
  t.is(normal.ppf(100), 141.4213562373095);
});

test('ceils ppf <= 0', t => {
  const normal = new Gaussian(0, 1);
  t.is(normal.ppf(0), -141.4213562373095);
  t.is(normal.ppf(-0), -141.4213562373095);
  t.is(normal.ppf(-0.1), -141.4213562373095);
  t.is(normal.ppf(-1), -141.4213562373095);
});
