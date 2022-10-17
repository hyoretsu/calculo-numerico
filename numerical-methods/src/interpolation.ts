import { evaluate } from 'mathjs';

import { fixNumber } from './utils';

type LagrangeInterpolation = (data: { x: number[]; y: number[]; targetX?: number }) => {
    polynomial: string;
    result?: number;
};

export const lagrangeInterpolation: LagrangeInterpolation = ({ x, y, targetX }) => {
    const polynomial = y
        .map((result, i) => {
            let numerator = '';
            let denominator = 1;

            x.forEach((_, j) => {
                if (j === i) return;

                numerator += `(x - ${x[j]})`;
                denominator *= x[i] - x[j];
            });

            return `${result} * (${numerator})/${fixNumber(denominator)}`;
        })
        .reduce((prev, curr) => (prev ? `${prev} + ${curr}` : curr), '');

    return {
        polynomial,
        ...(targetX && {
            result: fixNumber(evaluate(polynomial, { x: targetX })),
        }),
    };
};
