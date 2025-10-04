// forked from https://github.com/tomgp/gaussian

/**
 * Complementary error function
 * From Numerical Recipes in C 2e p221
 */
export function erfc(x: number): number {
  const z = Math.abs(x);
  const t = 1 / (1 + z / 2);
  // prettier-ignore
  const r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 +
          t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 +
          t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 +
          t * (-0.82215223 + t * 0.17087277)))))))));

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
  let r = -0.70711 * ((2.30753 + t * 0.27061) /
          (1 + t * (0.99229 + t * 0.04481)) - t);

  for (let j = 0; j < 2; j++) {
    const err = erfc(r) - xx;
    // oxlint-disable-next-line no-loss-of-precision
    r += err / (1.12837916709551257 * Math.exp(-(r * r)) - r * err);
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
    return this.fromPrecisionMean(
      precision + dprecision,
      precision * this.mean + dprecision * d.mean,
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
    return this.fromPrecisionMean(
      precision - dprecision,
      precision * this.mean - dprecision * d.mean,
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

  fromPrecisionMean(precision: number, precisionmean: number): Gaussian {
    return new Gaussian(precisionmean / precision, 1 / precision);
  }
}
