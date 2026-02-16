// forked from https://github.com/tomgp/gaussian

/**
 * Complementary error function
 * From Numerical Recipes in C 2e p221
 */
export function erfc(x: number): number {
  const z = Math.abs(x);
  const t = 1 / (1 + z / 2);
  // prettier-ignore
  const r = t * Math.exp(-z * z - 1.265_512_23 + t * (1.000_023_68 +
          t * (0.374_091_96 + t * (0.096_784_18 + t * (-0.186_288_06 +
          t * (0.278_868_07 + t * (-1.135_203_98 + t * (1.488_515_87 +
          t * (-0.822_152_23 + t * 0.170_872_77)))))))));

  return x >= 0 ? r : 2 - r;
}

/**
 * Inverse complementary error function
 * From Numerical Recipes 3e p265
 */
export function ierfc(x: number): number {
  if (x >= 2) {
    return -100;
  }

  if (x <= 0) {
    return 100;
  }

  const xx = x < 1 ? x : 2 - x;
  const t = Math.sqrt(-2 * Math.log(xx / 2));

  // prettier-ignore
  let r = -0.707_11 * ((2.307_53 + t * 0.270_61) /
          (1 + t * (0.992_29 + t * 0.044_81)) - t);

  for (let j = 0; j < 2; j++) {
    const err = erfc(r) - xx;
    // oxlint-disable-next-line no-loss-of-precision
    r += err / (1.128_379_167_095_512_57 * Math.exp(-(r * r)) - r * err);
  }

  return x < 1 ? r : -r;
}

/**
 * Models the [Normal](http://en.wikipedia.org/wiki/Normal_distribution) (or Gaussian) distribution.
 */
export class Gaussian {
  public mean: number;
  public variance: number;
  readonly standardDeviation: number;

  constructor(mean: number, variance: number) {
    this.mean = mean;
    this.variance = variance;

    if (variance <= 0) {
      throw new Error(`Variance must be > 0 (but was ${variance})`);
    }

    this.standardDeviation = Math.sqrt(variance);
  }

  /**
   * probability density function, which describes the probability
   * of a random variable taking on the value _x_
   */
  pdf(x: number): number {
    const m = this.standardDeviation * Math.sqrt(2 * Math.PI);
    const e = Math.exp(-((x - this.mean) ** 2) / (2 * this.variance));
    return e / m;
  }

  /**
   * cumulative distribution function, which describes the probability of a
   * random variable falling in the interval (−∞, _x_]
   */
  cdf(x: number): number {
    return 0.5 * erfc(-(x - this.mean) / (this.standardDeviation * Math.sqrt(2)));
  }

  /**
   * percent point function, the inverse of _cdf_
   */
  ppf(x: number): number {
    return this.mean - this.standardDeviation * Math.sqrt(2) * ierfc(2 * x);
  }

  /**
   * Product distribution of this and d (scale for constant)
   * @returns the product distribution of this and the given distribution;
   * equivalent to `scale(d)` when d is a constant
   */
  mul(d: number | Gaussian): Gaussian {
    if (typeof d === 'number') {
      return this.scale(d);
    }

    const precision = 1 / this.variance;
    const dprecision = 1 / d.variance;
    const totalPrecision = precision + dprecision;
    return new Gaussian(
      (precision * this.mean + dprecision * d.mean) / totalPrecision,
      1 / totalPrecision,
    );
  }

  /**
   * Quotient distribution of this and d (scale for constant)
   * @returns the quotient distribution of this and the given distribution; equivalent to `scale(1/d)` when d is a constant
   */
  div(d: number | Gaussian): Gaussian {
    if (typeof d === 'number') {
      return this.scale(1 / d);
    }

    const precision = 1 / this.variance;
    const dprecision = 1 / d.variance;
    const totalPrecision = precision - dprecision;
    return new Gaussian(
      (precision * this.mean - dprecision * d.mean) / totalPrecision,
      1 / totalPrecision,
    );
  }

  /**
   * Addition of this and d
   * @returns the result of adding this and the given distribution's means and variances
   */
  add(d: Gaussian): Gaussian {
    return new Gaussian(this.mean + d.mean, this.variance + d.variance);
  }

  /**
   * Subtraction of this and d
   * @returns the result of subtracting this and the given distribution's means and variances
   */
  sub(d: Gaussian): Gaussian {
    return new Gaussian(this.mean - d.mean, this.variance + d.variance);
  }

  /**
   * Scale this by constant c
   * @returns the result of scaling this distribution by the given constant
   */
  scale(c: number): Gaussian {
    return new Gaussian(this.mean * c, this.variance * c * c);
  }
}
