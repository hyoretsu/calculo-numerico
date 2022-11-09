import { evaluate } from 'mathjs';

import { FunctionZeros } from './functionZeros';
import { fixNumber } from './utils';

type MinMaxBisection = (info: {
    func: string;
    interval: number[];
    target: 'min' | 'max';
    precision: number;
    options?: Omit<FunctionZeros.Options, 'bail'>;
}) => [
    results: {
        iterations: number;
        interval: [string, string];
    },
    details: Array<
        Omit<FunctionZeros.Details, 'condition2'> & {
            interval: number[];
            results: number[];
        }
    >,
];

export const minMaxBisection: MinMaxBisection = ({
    func,
    interval: [a, b],
    target,
    precision,
    options: {
        conditionsWhitelist = [true, true],
        maxIterations = Infinity,
        origFunc,
        relativeError,
    } = {},
}) => {
    const details = [];
    let iterations = -1;
    let trueX = typeof relativeError === 'number' && relativeError;

    while (true) {
        const interval = [a, b];
        const results = [evaluate(func, { x: a }), evaluate(func, { x: b })];

        const midPoint = (a + b) / 2;
        const midResult = evaluate(func, { x: midPoint });

        iterations += 1;
        const condition1 = Math.abs(b - a);

        const swapPoints = (point: string) => {
            if (relativeError) {
                if (!trueX) {
                    if (point === 'a') {
                        trueX = a;
                    } else {
                        trueX = b;
                    }
                }

                relativeError = Math.abs(midPoint - trueX) / Math.abs(midPoint);
            }

            if (point === 'a') {
                a = midPoint;
            } else {
                b = midPoint;
            }
        };

        const targetSign = target === 'max' ? 1 : -1;
        if (
            Math.sign(midResult - results[0]) === targetSign &&
            Math.sign(evaluate(func, { x: (midPoint + b) / 2 }) - midResult) === targetSign
        ) {
            // If mid-point is higher/lower than A and the next mid-point is higher/lower than it, swap for A
            swapPoints('a');
        } else if (
            Math.sign(midResult - results[1]) === targetSign &&
            Math.sign(evaluate(func, { x: (midPoint + a) / 2 }) - midResult) === targetSign
        ) {
            // If mid-point is higher/lower than B and the next mid-point is higher/lower than it, swap for B
            swapPoints('b');
        } else if (Math.sign(results[0] - results[1]) === targetSign) {
            // If A is higher/lower than B, swap for A
            swapPoints('b');
        } else if (Math.sign(results[1] - results[0]) === targetSign) {
            // If B is higher/lower than A, swap for B
            swapPoints('a');
        }

        details.push({
            iteration: iterations,
            interval: interval.map(number => fixNumber(number)),
            results: results.map(number => fixNumber(number)),
            x: fixNumber(midPoint),
            ...(origFunc && { y: evaluate(origFunc, { x: midPoint }) }),
            ...(relativeError && { relativeError: fixNumber(relativeError as number) }),
            condition1: fixNumber(condition1),
        });

        // Check if conditions are either disabled or true
        const condition1Pass = !conditionsWhitelist[0] || condition1 < precision;

        if (condition1Pass || iterations >= maxIterations) break;
    }

    const minIterations = Math.ceil((Math.log10(b - a) - Math.log10(precision)) / Math.log10(2));
    if (iterations < minIterations && maxIterations === Infinity) {
        throw new Error(
            `Something went wrong, less iterations than the minimum (${minIterations}) were done.`,
        );
    }

    return [
        {
            iterations,
            interval: [a.toPrecision(21), b.toPrecision(21)],
        },
        details,
    ];
};
