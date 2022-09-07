interface Bisection {
    func: (x: number) => number;
    interval: [number, number];
    precision: number;
}

export const bisection = ({ func, interval: [a, b], precision }: Bisection) => {
    let condition1 = false,
        condition2 = false;
    let iterations = 0;

    const minIterations = (Math.log10(b - a) - Math.log10(precision)) / Math.log10(2);

    while (!condition1 && !condition2) {
        const results = [func(a), func(b)];

        condition1 = Math.abs(b - a) < precision;
        condition2 = Math.abs(results[1]) < precision;
        if (condition1 && condition2) break;

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

        iterations += 1;
    }

    if (iterations < minIterations) {
        throw new Error('Something went wrong, less iterations than the minimum were');
    }

    return { iterations, interval: [a, b] };
};
