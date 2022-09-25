import { bisection, falsePosition, newtonRaphson, secant } from 'numerical-methods';

let results, details, options;
let func = 'e^(-x^2) - 2x';
let interval = [0.41, 0.42];
let precision = 1e-8;
options = { maxIterations: 4, relativeError: 0.4194 };

[results, details] = bisection({
    func,
    interval,
    precision,
    options,
});
console.log(results);
console.log(details);
[results, details] = falsePosition({
    func,
    interval,
    precision,
    options,
});
console.log(results);
console.log(details);
[results, details] = newtonRaphson({
    func,
    initialX: 0.4,
    precision,
    options,
});
console.log(results);
console.log(details);
[results, details] = secant({
    func,
    interval,
    precision,
    options,
});
console.log(results);
console.log(details);

console.log(
    '-------------------------------------------------------------------------------------------------------------------------------------------------',
);

func =
    '500 + 0.8x + 4.1e-5 * x^2 + 2.1e-7 * x^3 + 4.8e-10 * x^4 - (1000 + 0.22x + 6.8e-5 * x^2 + 8.8e-7 * x^3)';
precision = 1e-9;

[results, details] = newtonRaphson({
    func,
    initialX: 1500,
    precision,
});
console.log(results);
console.log(details);

console.log(
    '-------------------------------------------------------------------------------------------------------------------------------------------------',
);

func = '(-1 + 80 * e^(x/80) * cos(2x) - 160 * e^(x/80)x * sin(2x)) / 80 * e^(x/80)';
interval = [15, 16];
precision = 1e-7;
options = { origFunc: 'e^(-x/80) + x * cos(2x)' };

[results, details] = falsePosition({
    func,
    interval,
    precision,
    options,
});
console.log(results);
console.log(details);
[results, details] = secant({
    func,
    interval,
    precision,
    options,
});
console.log(results);
console.log(details);
