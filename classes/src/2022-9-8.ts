import { bisection, falsePosition, newtonRaphson } from 'numerical-methods';

const interval: [number, number] = [1, 1.5];
const precision = 1e-6;

console.log(
    bisection({
        func: x => Math.exp(-x / 11) + x * Math.cos(2 * x),
        interval,
        precision,
    }),
);
console.log(
    falsePosition({
        func: x => Math.exp(-x / 11) + x * Math.cos(2 * x),
        interval,
        precision,
    }),
);
console.log(newtonRaphson({ func: 'e^(-x/11) + x * cos(2x)', initialX: 1.5, precision: 1e-4 }));
