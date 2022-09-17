import { derivative, evaluate } from 'mathjs';

type SimpleZerosFunction = (info: {
    func: string;
    interval: [number, number];
    precision: number;
    options?: {
        maxIterations: number;
    };
}) => [
    results: { iterations: number; interval: [string, string] },
    details: Array<{
        iteration: number;
        interval: number[];
        results: number[];
        x: number;
        y: number;
        condition1: number;
        condition2: number;
    }>,
];

export const bisection: SimpleZerosFunction = ({
    func,
    interval: [a, b],
    precision,
    options: { maxIterations } = { maxIterations: Infinity },
}) => {
    const details = [];
    let iterations = -1;

    const minIterations = Math.ceil((Math.log10(b - a) - Math.log10(precision)) / Math.log10(2));
    if (maxIterations < minIterations) {
        throw new Error(
            `The given maximum iterations is less than the minimum iterations (${minIterations}) for the given parameters.`,
        );
    }

    while (true) {
        const results = [evaluate(func, { x: a }), evaluate(func, { x: b })];

        const midPoint = (a + b) / 2;
        const midResult = evaluate(func, { x: midPoint });

        iterations += 1;
        const condition1 = Math.abs(b - a);
        const condition2 = Math.abs(midResult);

        details.push({
            iteration: iterations,
            interval: [a, b],
            results,
            x: midPoint,
            y: midResult,
            condition1,
            condition2,
        });

        if ((condition1 < precision && condition2 < precision) || iterations >= maxIterations)
            break;

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

    return [{ iterations, interval: [a.toPrecision(21), b.toPrecision(21)] }, details];
};

export const falsePosition: SimpleZerosFunction = ({
    func,
    interval: [a, b],
    precision,
    options: { maxIterations } = { maxIterations: Infinity },
}) => {
    const details = [];
    let iterations = -1;

    while (true) {
        const results = [evaluate(func, { x: a }), evaluate(func, { x: b })];

        const newPoint = (a * results[1] - b * results[0]) / (results[1] - results[0]);
        const newResult = evaluate(func, { x: newPoint });

        iterations += 1;
        const condition1 = Math.abs(b - a);
        const condition2 = Math.abs(newResult);

        details.push({
            iteration: iterations,
            interval: [a, b],
            results,
            x: newPoint,
            y: newResult,
            condition1,
            condition2,
        });

        if ((condition1 < precision && condition2 < precision) || iterations >= maxIterations)
            break;

        switch (Math.sign(newResult)) {
            case Math.sign(results[0]):
                a = newPoint;
                break;
            case Math.sign(results[1]):
                b = newPoint;
                break;
        }
    }

    return [{ iterations, interval: [a.toPrecision(21), b.toPrecision(21)] }, details];
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

    while (true) {
        const y = evaluate(func, { x });
        const diffY = derivative(func, 'x').evaluate({ x });

        const prevX = x;
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
