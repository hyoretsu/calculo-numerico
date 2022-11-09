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

export type InterpolationMethod = (data: Data) => Results;

export const lagrangeInterpolation: InterpolationMethod = ({ x, y, targetX }) => {
    const polynomial = y
        .map((result, i) => {
            let numerator = '';
            let denominator = 1;

            x.forEach((_, j) => {
                if (j === i) return;

                numerator += `(x ${Math.sign(x[j]) === 1 ? '-' : '+'} ${Math.abs(x[j])})`;
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

        return `${prev} ${Math.sign(curr) === 1 ? '+' : '-'} ${Math.abs(fixNumber(curr))} * x^${i}`;
    }, '');

    return {
        polynomial,
        ...(targetX && {
            result: fixNumber(evaluate(polynomial, { x: targetX })),
        }),
    };
};

type NewtonInterpolation = (data: Data) => Results & {
    dividedDifferences: number[][];
};

export const newtonInterpolation: NewtonInterpolation = ({ x, y, targetX }) => {
    const dividedDifferences: number[][] = [];

    // Creating all of the divided differences
    x.forEach((_, i) => {
        if (i === 0) {
            dividedDifferences.push(y);
            return;
        }

        const column = [];
        for (let j = 0; j < x.length - i; j++) {
            column.push(
                (dividedDifferences[i - 1][j + 1] - dividedDifferences[i - 1][j]) /
                    (x[i + j] - x[j]),
            );
        }
        dividedDifferences.push(column);
    });

    const polynomial = dividedDifferences
        .map((difference, i) => {
            if (i === 0) return String(difference[0]);

            let literal = '';
            for (let j = 0; j < i; j++) {
                literal += `(x ${Math.sign(x[j]) === 1 ? '-' : '+'} ${Math.abs(x[j])})`;
            }

            return `${Math.sign(difference[0]) === 1 ? '+' : '-'} ${Math.abs(
                difference[0],
            )} * ${literal}`;
        })
        .join(' ');

    return {
        polynomial,
        dividedDifferences,
        ...(targetX && {
            result: evaluate(polynomial, { x: targetX }),
        }),
    };
};
