import { derivative, evaluate } from 'mathjs';
import {
    gaussianElimination,
    gaussSeidel,
    lagrangeInterpolation,
    newtonInterpolation,
    newtonRaphson,
} from 'numerical-methods';

let details, dividedDifferences, polynomial, result, results, steps, transformedFuncs;

const coefficients = [
    [3.21, 7.8, 4.95, -6.35],
    [8.05, -4.7, 5.05, 1.25],
    [2.02, 7.77, -3.8, -6.72],
    [0.8, 9.05, -4.77, -4.78],
];
const independentTerms = [31.07, 38.8, 0, -20.67];

console.log('b)');
({ results, transformedFuncs, steps } = gaussianElimination({
    coefficients,
    independentTerms,
}));

// console.log(steps);
console.log(results);
console.log(transformedFuncs);

console.log('a)');
[results, details] = gaussSeidel({
    coefficients: [
        [8.05, -4.7, 5.05, 1.25],
        [0.8, 9.05, -4.77, -4.78],
        [3.21, 7.8, 4.95, -6.35],
        [2.02, 7.77, -3.8, -6.72],
    ],
    independentTerms: [38.8, -20.67, 31.07, 0],
    precision: 1e-4,
});

console.log(results);
// console.log(details);

console.log(
    '-------------------------------------------------------------------------------------------------------------------------------------------------',
);

({ results, transformedFuncs, steps } = gaussianElimination({
    coefficients: [
        [3, 2, 4],
        [2, 2, 3],
        [3, 3, 5],
    ],
    independentTerms: [80, 60, 95],
}));

// console.log(steps);
console.log(results);
console.log(transformedFuncs);

console.log(
    '-------------------------------------------------------------------------------------------------------------------------------------------------',
);

({ polynomial } = lagrangeInterpolation({
    x: [1, 1.5, 2, 2.5, 3],
    y: [66.8, 52.1, 18.03, 11.8, 10.12],
}));
console.log(`Polinômio interpolador de Lagrange: ${polynomial}`);

console.log('');

[results] = newtonRaphson({
    func: derivative(derivative(polynomial, 'x'), 'x').toString(),
    initialX: 5,
    precision: 1e-9,
});
console.log('Zero da função (Newton-Raphson) da derivada segunda do polinômio interpolador:');
console.log(results);

console.log('');

console.log(`Resultado desse ponto no polinômio interpolador: ${evaluate(polynomial, { x: 3 })}`);

console.log(
    '-------------------------------------------------------------------------------------------------------------------------------------------------',
);

const func = x => 1 / (1 + 2 * x ** 2);
const targetX = 0.5;

console.log('2º grau');
let x = [-1, 0, 1];
({ polynomial, dividedDifferences, result } = newtonInterpolation({
    x,
    y: x.map(number => func(number)),
    targetX,
}));
console.log(polynomial);
console.log(dividedDifferences);
console.log(result);

console.log('4º grau');
x = [-1, -0.5, 0, 0.5, 1];
({ polynomial, dividedDifferences, result } = newtonInterpolation({
    x,
    y: x.map(number => func(number)),
    targetX,
}));
console.log(polynomial);
console.log(dividedDifferences);
console.log(result);

console.log('8º grau');
x = [-1, -0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75, 1];
({ polynomial, dividedDifferences, result } = newtonInterpolation({
    x,
    y: x.map(number => func(number)),
    targetX,
}));
console.log(polynomial);
console.log(dividedDifferences);
console.log(result);
