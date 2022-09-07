interface Bisection {
    func: (x: number) => number;
    interval: [number, number];
    precision: number;
}

export const bisection = ({ func, interval, precision }: Bisection) => {
    let condition1 = false,
        condition2 = false;
    let iterations = 0;

    const minIterations =
        (Math.log10(interval[1] - interval[0]) - Math.log10(precision)) / Math.log10(2);

    while (!condition1 && !condition2) {
        const results = [func(interval[0]), func(interval[1])];

        condition1 = Math.abs(interval[1] - interval[0]) < precision;
        condition2 = Math.abs(results[1]) < precision;
        if (condition1 && condition2) break;

        const midPoint = (interval[0] + interval[1]) / 2;
        const midResult = func(midPoint);
        switch (Math.sign(midResult)) {
            case Math.sign(results[0]):
                interval[0] = midPoint;
                break;
            case Math.sign(results[1]):
                interval[1] = midPoint;
                break;
        }

        iterations += 1;
    }

    return { iterations, interval };
};
