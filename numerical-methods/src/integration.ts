import { derivative, evaluate } from 'mathjs';

import { minMaxBisection } from './custom';
import { isOdd, range } from './utils';

export type IntegrationMethod = (info: { func: string; pointN: number; x: [number, number] }) => {
    result: number;
    error: number;
};

export const trapezoidalRule: IntegrationMethod = ({ func, pointN, x }) => {
    const intervals = pointN - 1;

    const amplitude = (x[1] - x[0]) / intervals;
    const points = [...range(x[0], x[1], amplitude), x[1]];
    const y = points.map(number => evaluate(func, { x: number }));

    let result = y.reduce((sum, value, i) => {
        if (i === 0 || i === y.length - 1) {
            return sum + value;
        }

        return sum + 2 * value;
    }, 0);
    result *= amplitude / 2;

    const secondDerivative = derivative(derivative(func, 'x'), 'x').toString();

    const [
        {
            interval: [maxPoint],
        },
    ] = minMaxBisection({
        func: secondDerivative,
        interval: [x[0], x[1]],
        target: 'max',
        precision: 1e-12,
    });

    const error =
        (amplitude ** 3 / (12 * intervals ** 2)) *
        Math.abs(evaluate(secondDerivative, { x: maxPoint }));

    return { result, error };
};

export const simpsonRule13: IntegrationMethod = ({ func, pointN, x }) => {
    const intervals = pointN - 1;

    const amplitude = (x[1] - x[0]) / intervals;
    const points = [...range(x[0], x[1], amplitude), x[1]];
    const y = points.map(number => evaluate(func, { x: number }));

    let result = y.reduce((sum, value, i) => {
        if (i === 0 || i === y.length - 1) {
            return sum + value;
        }

        return sum + value * (isOdd(i) ? 4 : 2);
    }, 0);
    result *= amplitude / 3;

    const fourthDerivative = derivative(
        derivative(derivative(derivative(func, 'x'), 'x'), 'x'),
        'x',
    ).toString();

    const [
        {
            interval: [maxPoint],
        },
    ] = minMaxBisection({
        func: fourthDerivative,
        interval: [x[0], x[1]],
        target: 'max',
        precision: 1e-12,
    });

    const error =
        (amplitude ** 5 / (180 * intervals ** 2)) *
        Math.abs(evaluate(fourthDerivative, { x: maxPoint }));

    return { result, error };
};
