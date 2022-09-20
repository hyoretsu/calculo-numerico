import { bisection, falsePosition, newtonRaphson, secant } from 'numerical-methods';

let results, details;
let func = '2pi * x^2 * ((9 - x) / 3) - (30 * 280)';
let interval = [-13.5, -13];
let precision = 1e-7;

[results, details] = falsePosition({
    func,
    interval,
    precision,
    options: { maxIterations: 3 },
});
console.log(results);
// console.log(details);
[results, details] = newtonRaphson({
    func,
    initialX: -13.5,
    precision,
    options: { maxIterations: 3 },
});
console.log(results);
// console.log(details);

console.log(
    '-------------------------------------------------------------------------------------------------------------------------------------------------',
);

func = 'x^4 -16x^3 + 500x^2 - 8000x + 32000';
interval = [5.8, 6];
precision = 1e-5;

[results, details] = bisection({
    func,
    interval,
    precision,
    options: { conditionsWhitelist: [false, true] },
});
console.log(results);
// console.log(details);
[results, details] = secant({
    func,
    interval,
    precision,
    options: { conditionsWhitelist: [false, true] },
});
console.log(results);
// console.log(details);
