type Interval = [number, number];

type Bisection = (
    func: (x: number) => number,
    interval: Interval,
    precision: number,
    options?: {
        maxIterations: number;
    },
) => { iterations: number; interval: [number, number] };

export const bisection: Bisection = (
    func,
    [a, b],
    precision,
    options = { maxIterations: Infinity },
) => {
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
        if (iterations >= options.maxIterations) {
            throw new Error('Maximum iterations exceeded.');
        }

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

    return { iterations, interval: [a, b] };
};

type FalsePosition = (
    func: (x: number) => number,
    interval: Interval,
    precision: number,
    options?: {
        maxIterations: number;
    },
) => { iterations: number; interval: [number, number] };

export const falsePosition: FalsePosition = (
    func,
    [a, b],
    precision,
    options = { maxIterations: Infinity },
) => {
    let condition1, condition2;
    let iterations = 0;

    while (true) {
        const results = [func(a), func(b)];

        condition1 = Math.abs(b - a) < precision;
        condition2 = Math.abs(results[0]) < precision;
        if (condition1 || condition2) break;

        iterations += 1;
        if (iterations >= options.maxIterations) {
            throw new Error('Maximum iterations exceeded.');
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

    return { iterations, interval: [a, b] };
};
