import { evaluate } from 'mathjs';

import { gaussSeidel } from './linearSystems';
import { fixNumber, range } from './utils';

interface Data {
    x: number[];
    y: number[];
    targetX?: number;
}

interface Results {
    polynomial: string;
    result?: number;
}

type InterpolationMethod = (data: Data) => Results;

export const lagrangeInterpolation: InterpolationMethod = ({ x, y, targetX }) => {
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

export const vandermondeInterpolation: InterpolationMethod = ({ x, y, targetX }) => {
    const dimension = x.length;

    const [{ solution: vandermondeResults }] = gaussSeidel({
        coefficients: x.map((coefficient, i) => range(dimension).map(j => coefficient ** j)),
        independentTerms: y,
        precision: 1e-9,
    });

    const polynomial = vandermondeResults.reduce((prev, curr, i) => {
        if (i === 0) return String(fixNumber(curr));

        return `${prev} + ${fixNumber(curr)} * x^${i}`;
    }, '');

    return {
        polynomial,
        ...(targetX && {
            result: fixNumber(evaluate(polynomial, { x: targetX })),
        }),
    };
};
