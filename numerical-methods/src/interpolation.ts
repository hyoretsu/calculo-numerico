import { evaluate } from 'mathjs';

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

                // numerator += `${!numerator ? '' : '* '}(x - ${x[j]})`;
                numerator += `(x - ${x[j]})`;
                denominator *= x[i] - x[j];
            });

            return `${result} * (${numerator})/${Number(denominator.toPrecision(15))}`;
        })
        .reduce((prev, curr) => (prev ? `${prev} + ${curr}` : curr), '');

    return {
        polynomial,
        ...(targetX && {
            result: Number(evaluate(polynomial, { x: targetX }).toPrecision(15)),
        }),
    };
};
