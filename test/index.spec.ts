// Tests based on values from Wolfram Alpha.
import { describe, expect, it } from 'vitest';

import { Gaussian } from '../src/index.js';

function epsilonEqual(actual: number, expected: number): void {
  const diff = Math.abs(actual - expected);
  expect(diff < 1e-5).toBeTruthy();
}

function gaussianEqual(actual: Gaussian, expected: Gaussian): void {
  expect(actual.mean).toEqual(expected.mean);
  expect(actual.variance).toEqual(expected.variance);
}

it('should have default properties', () => {
  const d1 = new Gaussian(0, 1);
  expect(d1.mean).toEqual(0);
  expect(d1.variance).toEqual(1);
  expect(d1.standardDeviation).toEqual(1);

  const d2 = new Gaussian(1, 4);
  expect(d2.mean).toEqual(1);
  expect(d2.variance).toEqual(4);
  expect(d2.standardDeviation).toEqual(2);
});

it('should compute pdf', () => {
  const d = new Gaussian(0, 1);
  epsilonEqual(d.pdf(-2), 0.053991);
  epsilonEqual(d.pdf(-1), 0.241971);
  epsilonEqual(d.pdf(0), 0.398942);
  epsilonEqual(d.pdf(1), 0.241971);
  epsilonEqual(d.pdf(2), 0.053991);
});

it('should compute cdf', () => {
  const d = new Gaussian(0, 1);
  epsilonEqual(d.cdf(-1.28155), 0.1);
  epsilonEqual(d.cdf(-0.67449), 0.25);
  epsilonEqual(d.cdf(0), 0.5);
  epsilonEqual(d.cdf(0.67449), 0.75);
  epsilonEqual(d.cdf(1.28155), 0.9);
});

it('should compute ppf', () => {
  const d = new Gaussian(0, 1);
  epsilonEqual(d.ppf(0.1), -1.28155);
  epsilonEqual(d.ppf(0.25), -0.67449);
  epsilonEqual(d.ppf(0.5), 0);
  epsilonEqual(d.ppf(0.75), 0.67449);
  epsilonEqual(d.ppf(0.9), 1.28155);
});

it('should compute mul', () => {
  // Test normal mul.
  const d = new Gaussian(0, 1).mul(new Gaussian(0, 1));
  gaussianEqual(d, new Gaussian(0, 0.5));
  // Test scale.
  gaussianEqual(new Gaussian(1, 1).mul(2), new Gaussian(2, 4));
});

it('should compute div', () => {
  // Test normal div.
  const d = new Gaussian(1, 1).div(new Gaussian(1, 2));
  gaussianEqual(d, new Gaussian(1, 2));
  // Test scale.
  gaussianEqual(new Gaussian(1, 1).div(1 / 2), new Gaussian(2, 4));
});

it('should compute add', () => {
  gaussianEqual(new Gaussian(1, 1).add(new Gaussian(1, 2)), new Gaussian(2, 3));
});

it('should compute sub', () => {
  gaussianEqual(new Gaussian(1, 1).sub(new Gaussian(1, 2)), new Gaussian(0, 3));
});

it('should compute scale', () => {
  gaussianEqual(new Gaussian(1, 1).scale(2), new Gaussian(2, 4));
});

it('should rejects non-positive variances', () => {
  expect(() => new Gaussian(0, 0)).toThrowError();
  expect(() => new Gaussian(0, -1)).toThrowError();
});

it('ceils ppf >= 1', () => {
  const normal = new Gaussian(0, 1);
  expect(normal.ppf(1)).toBe(141.4213562373095);
  expect(normal.ppf(1.1)).toBe(141.4213562373095);
  expect(normal.ppf(100)).toBe(141.4213562373095);
});

it('ceils ppf <= 0', () => {
  const normal = new Gaussian(0, 1);
  expect(normal.ppf(0)).toBe(-141.4213562373095);
  expect(normal.ppf(-0)).toBe(-141.4213562373095);
  expect(normal.ppf(-0.1)).toBe(-141.4213562373095);
  expect(normal.ppf(-1)).toBe(-141.4213562373095);
});
