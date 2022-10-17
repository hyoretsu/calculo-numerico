import { newtonInterpolation } from 'numerical-methods';

let polynomial, dividedDifferences;

({ polynomial, dividedDifferences } = newtonInterpolation({
    x: [-1, 0, 2],
    y: [4, 1, 1],
}));
console.log(polynomial);
console.log(dividedDifferences);

console.log(
    '-------------------------------------------------------------------------------------------------------------------------------------------------',
);

({ polynomial, dividedDifferences } = newtonInterpolation({
    x: [-1, 0, 1, 2, 3],
    y: [1, 1, 0, -1, -2],
}));
console.log(polynomial);
console.log(dividedDifferences);
