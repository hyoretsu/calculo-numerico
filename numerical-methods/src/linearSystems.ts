// Calcula determinante, tem q ser diferente de 0
// Parada 1: maior diferença absoluta entre os X menor que precisão
// a
// Chute inicial é termo independente dividido pelo coeficiente do X

import { evaluate } from 'mathjs';

import { range } from './utils';

interface Details {
    iteration: number;
    solution: number[];
    absoluteError: number;
    relativeError?: number;
}

interface Options {
    /** Maximum number of iterations. */
    maxIterations?: number;
    /** Outputs the relative error between the new X and the last X or the true X, if given. */
    relativeError?: number | boolean;
}

type GaussMethod = (data: {
    coefficients: number[][];
    independentTerms: number[];
    precision: number;
    options?: Options;
}) => [
    results: {
        iterations: number;
        iterationFunc: string[];
        solution: number[];
    },
    details: Array<Details>,
];

export const gaussJacobi: GaussMethod = ({
    coefficients,
    independentTerms,
    precision,
    options: { maxIterations = Infinity, relativeError = false } = {},
}) => {
    const details = [];
    let iterations = 0;

    const dimension = independentTerms.length;
    const iterationFunc = independentTerms.map((number, i) => {
        return [
            ...range(dimension - 1).map(j => {
                const correctJ = j >= i ? j + 1 : j;

                return `${-coefficients[i][correctJ] / coefficients[i][i]} * ${String.fromCharCode(
                    'a'.charCodeAt(0) + correctJ,
                )} + `;
            }),
            String(number / coefficients[i][i]),
        ].join('');
    });
    console.log(iterationFunc);
    let solution = independentTerms.map((number, i) => number / coefficients[i][i]);

    while (true) {
        const prevSolution = solution;

        solution = iterationFunc.map((func, i) =>
            evaluate(
                func,
                solution.reduce((prev, curr) => {
                    return {
                        ...prev,
                        [String.fromCharCode('a'.charCodeAt(0) + Object.entries(prev).length)]:
                            curr,
                    };
                }, {}),
            ),
        );

        iterations += 1;
        const absoluteError = Math.max(
            ...solution.map((current, i) => Math.abs(current - prevSolution[i])),
        );

        if (relativeError) {
            relativeError = absoluteError / Math.max(...solution);
        }

        details.push({
            iteration: iterations,
            solution: prevSolution,
            absoluteError,
            ...(typeof relativeError === 'number' && { relativeError }),
        });

        if (absoluteError < precision || iterations >= maxIterations) break;
    }

    return [{ iterations, iterationFunc, solution }, details];
};

export const gaussSeidel: GaussMethod = ({
    coefficients,
    independentTerms,
    precision,
    options: { maxIterations = Infinity, relativeError = false } = {},
}) => {
    const details = [];
    let iterations = -1;

    const dimension = independentTerms.length;
    const iterationFunc = independentTerms.map((number, i) => {
        return [
            ...range(dimension - 1).map(j => {
                const correctJ = j >= i ? j + 1 : j;

                return `${-coefficients[i][correctJ] / coefficients[i][i]} * ${String.fromCharCode(
                    'a'.charCodeAt(0) + correctJ,
                )} + `;
            }),
            String(number / coefficients[i][i]),
        ].join('');
    });
    const solution = [0, 0];

    while (true) {
        const prevSolution = [...solution];

        iterationFunc.forEach((func, i) => {
            solution[i] = evaluate(
                func,
                solution.reduce(
                    (prev, curr) => ({
                        ...prev,
                        [String.fromCharCode('a'.charCodeAt(0) + Object.entries(prev).length)]:
                            curr,
                    }),
                    {},
                ),
            );
        });

        iterations += 1;
        const absoluteError = Math.max(
            ...solution.map((current, i) => Math.abs(current - prevSolution[i])),
        );

        if (relativeError) {
            relativeError = absoluteError / Math.max(...solution);
        }

        details.push({
            iteration: iterations,
            solution: prevSolution,
            absoluteError,
            ...(typeof relativeError === 'number' && { relativeError }),
        });

        if ((iterations > 0 && absoluteError < precision) || iterations >= maxIterations) break;
    }

    return [{ iterations, iterationFunc, solution }, details];
};
