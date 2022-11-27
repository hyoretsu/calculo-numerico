// Distribuição binomial

import { newtonRaphson, simpsonRule13 } from 'numerical-methods';

// Input
const n = 60;
const successPercentage = 0.5;
const x = 27.5;

const meanValue = n * successPercentage;
const variance = meanValue * (1 - successPercentage);
const standardDeviation = Math.sqrt(variance);

console.log(`Escore-Z: ${(x - meanValue) / standardDeviation}`);

const densityFormula = `(e ^ (-((x - ${meanValue}) ^ 2) / (2 * ${variance}))) / (${standardDeviation} * sqrt(2pi))`;
console.log(`Função densidade de probabilidade (FDP): ${densityFormula}`);

const start = Date.now();

const results = newtonRaphson({
    func: densityFormula,
    initialX: meanValue - variance,
    precision: 1e-9,
})[0];

console.log(`Zero da FDP: ${results}`);
console.log(`Duração: ${(Date.now() - start) / 1000}s`);

console.log(
    `Probabilidade de X ser <= ${x - 0.5}: ${simpsonRule13({
        func: densityFormula,
        x: [Number(results.x), x],
        pointN: 10000,
    })}`,
);
