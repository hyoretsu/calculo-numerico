import { gaussJacobi, gaussSeidel } from 'numerical-methods';

let results, details;

[results, details] = gaussJacobi({
    coefficients: [
        [10, 2, 1],
        [1, 5, 1],
        [2, 3, 10],
    ],
    independentTerms: [7, -8, 6],
    precision: 5e-2,
});
console.log(results);
// console.log(details);

console.log(
    '-------------------------------------------------------------------------------------------------------------------------------------------------',
);

[results, details] = gaussSeidel({
    coefficients: [
        [5, 1, 1],
        [3, 4, 1],
        [3, 3, 6],
    ],
    independentTerms: [5, 6, 0],
    precision: 5e-2,
});
console.log(results);
// console.log(details);
