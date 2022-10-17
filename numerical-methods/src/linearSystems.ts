// Calcula determinante, tem q ser diferente de 0
// Parada 1: maior diferença absoluta entre os X menor que precisão
// a
// Chute inicial é termo independente dividido pelo coeficiente do X

import { evaluate } from 'mathjs';

import { fixNumber, range } from './utils';

interface Details {
    iteration: number;
    currentGuess: number[];
    nextGuess: number[];
    absoluteError: number;
    relativeError: number;
}

interface Options {
    /** Maximum number of iterations. */
    maxIterations?: number;
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
        spectralRadius: number;
        solution: number[];
    },
    details: Array<Details>,
];

export const gaussJacobi: GaussMethod = ({
    coefficients,
    independentTerms,
    precision,
    options: { maxIterations = Infinity } = {},
}) => {
    const details = [];
    let iterations = 0;

    const spectralRadius = Math.max(
        ...coefficients.map(
            (number, i) =>
                number.reduce((prev, curr) => prev + Math.abs(curr), 0) / Math.abs(number[i]),
        ),
    );
    if (spectralRadius >= 1) {
        throw new Error('Convergence is only guaranteed for p(A) < 1.');
    }

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
    let guess = independentTerms.map((number, i) => number / coefficients[i][i]);

    while (true) {
        const prevGuess = guess;

        guess = iterationFunc.map((func, i) =>
            evaluate(
                func,
                guess.reduce((prev, curr) => {
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
            ...guess.map((current, i) => Math.abs(current - prevGuess[i])),
        );
        const relativeError = absoluteError / Math.max(...guess);

        details.push({
            iteration: iterations,
            currentGuess: prevGuess.map(number => fixNumber(number)),
            nextGuess: guess.map(number => fixNumber(number)),
            absoluteError: fixNumber(absoluteError),
            relativeError: fixNumber(relativeError),
        });

        if (relativeError < precision || iterations >= maxIterations) break;
    }

    return [
        {
            iterations,
            iterationFunc,
            spectralRadius,
            solution: guess,
        },
        details,
    ];
};

export const gaussSeidel: GaussMethod = ({
    coefficients,
    independentTerms,
    precision,
    options: { maxIterations = Infinity } = {},
}) => {
    const details = [];
    let iterations = 0;

    const spectralRadius = Math.max(
        ...coefficients.map(
            (number, i) =>
                number.reduce((prev, curr) => prev + Math.abs(curr), 0) / Math.abs(number[i]),
        ),
    );
    if (spectralRadius >= 1) {
        throw new Error('Convergence is only guaranteed for p(A) < 1.');
    }

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
    const guess = independentTerms.map(_ => 0);

    while (true) {
        const prevGuess = [...guess];

        iterationFunc.forEach((func, i) => {
            guess[i] = evaluate(
                func,
                guess.reduce(
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
            ...guess.map((current, i) => Math.abs(current - prevGuess[i])),
        );
        const relativeError = absoluteError / Math.max(...guess);

        details.push({
            iteration: iterations,
            currentGuess: prevGuess.map(number => fixNumber(number)),
            nextGuess: guess.map(number => fixNumber(number)),
            absoluteError: fixNumber(absoluteError),
            relativeError: fixNumber(relativeError),
        });

        if ((iterations > 0 && relativeError < precision) || iterations >= maxIterations) break;
    }

    return [
        {
            iterations,
            iterationFunc,
            spectralRadius,
            solution: guess,
        },
        details,
    ];
};
