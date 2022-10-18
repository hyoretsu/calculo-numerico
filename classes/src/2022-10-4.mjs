import { gaussianElimination } from 'numerical-methods';

const { transformedFuncs, results } = gaussianElimination({
    coefficients: [
        [0, 8, 2],
        [3, 5, 2],
        [6, 2, 8],
    ],
    independentTerms: [-7, 8, 26],
});
console.log(transformedFuncs);
console.log(results);
