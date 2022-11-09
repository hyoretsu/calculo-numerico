import { derivative, evaluate } from 'mathjs';

import { newtonRaphson } from './functionZeros';
import { isOdd, range } from './utils';

export type IntegrationMethod = (info: { func: string; pointN: number; x: [number, number] }) => {
    result: number;
    error: number;
};

const findMaximumPoint = (func: string, initialGuess: number) => {
    let currentGuess = initialGuess;

    while (true) {
        const [{ x: point }] = newtonRaphson({
            func: derivative(func, 'x').toString(),
            initialX: currentGuess,
            precision: 1e-12,
        });
        const numberPoint = Number(point);

        const midResult = evaluate(func, { x: numberPoint });
        const leftResult = evaluate(func, { x: numberPoint - 0.01 });
        const rightResult = evaluate(func, { x: numberPoint + 0.01 });

        if (leftResult < midResult && rightResult < midResult) {
            currentGuess = numberPoint;
            break;
        }

        currentGuess = numberPoint + 5;
    }

    return currentGuess;
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

    let error = 0;
    switch (func) {
        // Maximum point's at the highest X in the interval
        case 'e^x':
            error =
                (amplitude ** 3 / (12 * intervals ** 2)) * Math.abs(evaluate(func, { x: x[1] }));

            break;
        // Find maximum point of second derivative for error calculation
        default: {
            const secondDerivative = derivative(derivative(func, 'x'), 'x').toString();

            const maxPoint = findMaximumPoint(secondDerivative.toString(), 1);

            error =
                (amplitude ** 3 / (12 * intervals ** 2)) *
                Math.abs(evaluate(secondDerivative, { x: maxPoint }));

            break;
        }
    }

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

    let error = 0;
    switch (func) {
        // Maximum point's at the highest X in the interval
        case 'e^x':
            error =
                (amplitude ** 3 / (12 * intervals ** 2)) * Math.abs(evaluate(func, { x: x[1] }));

            break;
        // Find maximum point of fourth derivative for error calculation
        default: {
            const fourthDerivative = derivative(
                derivative(derivative(derivative(func, 'x'), 'x'), 'x'),
                'x',
            ).toString();

            const maxPoint = findMaximumPoint(fourthDerivative, 1);

            error =
                (amplitude ** 5 / (12 * intervals ** 2)) *
                Math.abs(evaluate(fourthDerivative, { x: maxPoint }));

            break;
        }
    }

    return { result, error };
};
