import { evaluate } from 'mathjs';

import { fixNumber, range, swap } from './utils';

interface Matrix {
    coefficients: number[][];
    independentTerms: number[];
}

export const gaussianElimination = ({ coefficients, independentTerms }: Matrix) => {
    const transformedFuncs = [];
    const results = {};

    for (let j = 0; j < coefficients.length; j++) {
        let highestLine = j;

        // Find the correct pivot's line
        for (let i = j; i < coefficients.length; i++) {
            if (i === j) continue;

            if (coefficients[i][j] > coefficients[highestLine][j]) {
                highestLine = i;
            }
        }

        coefficients = swap(coefficients, j, highestLine);
        independentTerms = swap(independentTerms, j, highestLine);

        const multipliers = [];

        // Find multipliers for each line
        for (let i = j + 1; i < coefficients.length; i++) {
            multipliers[i] = coefficients[i][j] / coefficients[j][j];
        }

        // Transform next lines with multipliers
        for (let i = j + 1; i < coefficients.length; i++) {
            for (let k = j; k < coefficients.length; k++) {
                coefficients[i][k] -= multipliers[i] * coefficients[j][k];
            }

            independentTerms[i] -= multipliers[i] * independentTerms[j];
        }
    }

    // Solve the system
    for (let i = coefficients.length - 1; i >= 0; i--) {
        let equation = '';

        for (let j = 0; j < coefficients.length; j++) {
            if (coefficients[i][j] === 0) continue;

            if (equation === '') {
                equation = `${String.fromCharCode('a'.charCodeAt(0) + j)} = () / ${
                    coefficients[i][j]
                }`;
                continue;
            }

            equation = equation.replace(
                /\((.*)\)/,
                `($1-${coefficients[i][j]}${String.fromCharCode('a'.charCodeAt(0) + j)} + )`,
            );
        }
        equation = equation.replace(/\((.*)\)/, `($1${independentTerms[i]})`);
        transformedFuncs.push(equation);

        evaluate(equation, results);
    }

    return {
        transformedFuncs,
        results,
    };
};

type GaussMethod = (
    data: Matrix & {
        precision: number;
        options?: {
            /** Maximum number of iterations. */
            maxIterations?: number;
        };
    },
) => [
    results: {
        iterations: number;
        iterationFunc: string[];
        spectralRadius: number;
        solution: number[];
    },
    details: Array<{
        iteration: number;
        currentGuess: number[];
        nextGuess: number[];
        absoluteError: number;
        relativeError: number;
    }>,
];

export const spectralRadius = (coefficients: number[][]): number => {
    return Math.max(
        ...coefficients.map(
            (number, i) =>
                number.reduce((prev, curr) => prev + Math.abs(curr), 0) / Math.abs(number[i]),
        ),
    );
};

export const gaussJacobi: GaussMethod = ({
    coefficients,
    independentTerms,
    precision,
    options: { maxIterations = Infinity } = {},
}) => {
    const details = [];
    let iterations = 0;

    const dimension = independentTerms.length;
    // Creating iteration functions
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

        // Applying guesses to the iteration functions
        guess = iterationFunc.map((func, i) =>
            evaluate(
                func,
                // Merging all guesses in a single object
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
            spectralRadius: spectralRadius(coefficients),
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

    const dimension = independentTerms.length;
    // Creating iteration functions
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

        // Applying each guess to the next iteration function
        iterationFunc.forEach((func, i) => {
            guess[i] = evaluate(
                func,
                // Merging all guesses in a single object
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
            spectralRadius: spectralRadius(coefficients),
            solution: guess,
        },
        details,
    ];
};
