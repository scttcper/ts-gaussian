# ts-gaussian [![npm](https://img.shields.io/npm/v/ts-gaussian.svg?maxAge=3600)](https://www.npmjs.com/package/ts-gaussian)

> A JavaScript model of the [Normal](http://en.wikipedia.org/wiki/Normal_distribution)
> (or Gaussian) distribution.

**API Docs**: https://ts-gaussian.vercel.app

## Creating a Distribution

```ts
import { Gaussian } from 'ts-gaussian';
const distribution = new Gaussian(0, 1);
// Take a random sample using the inverse transform sampling method.
const sample = distribution.ppf(Math.random());
// 0.5071973169873031 or something similar
```

## Properties

- `mean`: the mean (μ) of the distribution
- `variance`: the variance (σ^2) of the distribution
- `standardDeviation`: the standard deviation (σ) of the distribution

## Probability Functions

- `pdf(x)`: the probability density function, which describes the probability
  of a random variable taking on the value _x_
- `cdf(x)`: the cumulative distribution function, which describes the probability of a random variable falling in the interval (−∞, _x_]
- `ppf(x)`: the percent point function, the inverse of _cdf_

## Combination Functions

- `mul(d)`: returns the product distribution of this and the given distribution; equivalent to `scale(d)` when `d` is a constant
- `div(d)`: returns the quotient distribution of this and the given distribution; equivalent to `scale(1/d)` when `d` is a constant
- `add(d)`: returns the sum of the means and variances of this distribution and the given distribution
- `sub(d)`: returns the difference of the means and variances of this distribution and the given distribution
- `scale(c)`: returns the result of scaling this distribution by the given constant

## See Also

**ts-trueskill**: https://github.com/scttcper/ts-trueskill

### Forked From

**Source**: https://github.com/errcw/gaussian  
**ES5 Fork**: https://github.com/tomgp/gaussian
