import { derivative, evaluate } from 'mathjs';

type SimpleZerosFunction = (info: {
    func: (x: number) => number;
    interval: [number, number];
    precision: number;
    options?: {
        maxIterations: number;
    };
}) => { iterations: number; interval: [string, string] };

export const bisection: SimpleZerosFunction = ({
    func,
    interval: [a, b],
    precision,
    options = { maxIterations: Infinity },
}) => {
    let condition1, condition2;
    let iterations = 0;

    const minIterations = Math.ceil((Math.log10(b - a) - Math.log10(precision)) / Math.log10(2));
    if (options.maxIterations < minIterations) {
        throw new Error(
            `The given maximum iterations is less than the minimum iterations (${minIterations}) for the given parameters.`,
        );
    }

    while (true) {
        const results = [func(a), func(b)];

        condition1 = Math.abs(b - a) < precision;
        condition2 = Math.abs(results[1]) < precision;
        if (condition1 || condition2) break;

        iterations += 1;
        if (iterations >= options.maxIterations) break;

        const midPoint = (a + b) / 2;
        const midResult = func(midPoint);
        switch (Math.sign(midResult)) {
            case Math.sign(results[0]):
                a = midPoint;
                break;
            case Math.sign(results[1]):
                b = midPoint;
                break;
        }
    }

    if (iterations < minIterations) {
        throw new Error(
            `Something went wrong, less iterations than the minimum (${minIterations}) were done.`,
        );
    }

    return { iterations, interval: [a.toPrecision(21), b.toPrecision(21)] };
};

export const falsePosition: SimpleZerosFunction = ({
    func,
    interval: [a, b],
    precision,
    options = { maxIterations: Infinity },
}) => {
    let condition1, condition2;
    let iterations = 0;

    while (true) {
        const results = [func(a), func(b)];

        condition1 = Math.abs(b - a) < precision;
        condition2 = Math.abs(results[0]) < precision;
        if (condition1 || condition2) break;

        iterations += 1;
        if (iterations >= options.maxIterations) {
            break;
        }

        const newPoint = (a * func(b) - b * func(a)) / (func(b) - func(a));
        const newResult = func(newPoint);
        switch (Math.sign(newResult)) {
            case Math.sign(results[0]):
                a = newPoint;
                break;
            case Math.sign(results[1]):
                b = newPoint;
                break;
        }
    }

    return { iterations, interval: [a.toPrecision(21), b.toPrecision(21)] };
};

type NewtonRaphson = (params: {
    func: string;
    initialX: number;
    precision: number;
    options?: {
        maxIterations: number;
    };
}) => [
    results: {
        iterations: number;
        x: string;
    },
    details: Array<{
        iteration: number;
        prevX: number;
        x: number;
        y: number;
        diffY: number;
        condition1: number;
        condition2: number;
    }>,
];

export const newtonRaphson: NewtonRaphson = ({
    func,
    initialX: x,
    precision,
    options: { maxIterations } = { maxIterations: Infinity },
}) => {
    const details = [];
    let iterations = -1;
    let prevX;

    while (true) {
        const y = evaluate(func, { x });
        const diffY = derivative(func, 'x').evaluate({ x });

        prevX = x;
        x -= evaluate(func, { x }) / diffY;

        iterations += 1;

        const condition1 = Math.abs(x - prevX);
        const condition2 = Math.abs(evaluate(func, { x }));

        details.push({
            iteration: iterations,
            prevX,
            x,
            y,
            diffY,
            condition1,
            condition2,
        });

        if ((condition1 < precision && condition2 < precision) || iterations >= maxIterations)
            break;
    }

    return [{ iterations, x: x.toPrecision(21) }, details];
};
