import {
    gaussianElimination,
    gaussJacobi,
    gaussSeidel,
    lagrangeInterpolation,
    newtonRaphson,
    spectralRadius,
    vandermondeInterpolation,
} from 'numerical-methods';

let polynomial, result;

({ polynomial, result } = vandermondeInterpolation({
    x: [1.3, 1.4, 1.5],
    y: [3.669, 4.055, 4.482],
    targetX: 1.32,
}));
console.log(polynomial);
console.log(result);

console.log(
    '-------------------------------------------------------------------------------------------------------------------------------------------------',
);

({ polynomial } = vandermondeInterpolation({
    x: [2, 3, 4],
    y: [-1.8137, 0.0958, 2.3452],
}));
console.log(polynomial);

const [{ x: zero }] = newtonRaphson({
    func: polynomial,
    initialX: 3,
    precision: 1e-12,
});
console.log(`Raiz da função (x * lnx - 3.2): ${zero}`);

console.log(
    '-------------------------------------------------------------------------------------------------------------------------------------------------',
);

({ polynomial, result } = lagrangeInterpolation({
    x: [1.3, 1.4, 1.5],
    y: [3.669, 4.055, 4.482],
    targetX: 1.32,
}));
console.log(polynomial);
console.log(`Resultado: ${result}`);

console.log(
    '-------------------------------------------------------------------------------------------------------------------------------------------------',
);

let x = [1.3, 1.6];
({ polynomial, result } = lagrangeInterpolation({
    x,
    y: [0.620086, 0.4554022],
    targetX: 1.5,
}));
console.log('Pontos [1.3, 1.6]');
console.log(polynomial);
console.log(`Resultado: ${result}`);

console.log('');

x = [1, 1.3, 1.6];
({ polynomial, result } = lagrangeInterpolation({
    x,
    y: [0.7651977, 0.620086, 0.4554022],
    targetX: 1.5,
}));
console.log('Pontos [1, 1.3, 1.6]');
console.log(polynomial);
console.log(`Resultado: ${result}`);

console.log('');

x = [1.3, 1.6, 1.9];
({ polynomial, result } = lagrangeInterpolation({
    x,
    y: [0.620086, 0.4554022, 0.2818186],
    targetX: 1.5,
}));
console.log('Pontos [1.3, 1.6, 1.9]');
console.log(polynomial);
console.log(`Resultado: ${result}`);

console.log('');

x = [1, 1.3, 1.6, 1.9];
({ polynomial, result } = lagrangeInterpolation({
    x,
    y: [0.7651977, 0.620086, 0.4554022, 0.2818186],
    targetX: 1.5,
}));
console.log('Pontos [1, 1.3, 1.6, 1.9]');
console.log(polynomial);
console.log(`Resultado: ${result}`);

console.log('');

x = [1.3, 1.6, 1.9, 2.2];
({ polynomial, result } = lagrangeInterpolation({
    x,
    y: [0.620086, 0.4554022, 0.2818186, 0.1103623],
    targetX: 1.5,
}));
console.log('Pontos [1.3, 1.6, 1.9, 2.2]');
console.log(polynomial);
console.log(`Resultado: ${result}`);

console.log('');

x = [1, 1.3, 1.6, 1.9, 2.2];
({ polynomial, result } = lagrangeInterpolation({
    x,
    y: [0.7651977, 0.620086, 0.4554022, 0.2818186, 0.1103623],
    targetX: 1.5,
}));
console.log('Pontos [1, 1.3, 1.6, 1.9, 2.2]');
console.log(polynomial);
console.log(`Resultado: ${result}`);

console.log(
    '-------------------------------------------------------------------------------------------------------------------------------------------------',
);

let coefficients = [
    [1, 2, 1],
    [2, 3, 1],
    [3, 5, 2],
];
let independentTerms = [3, 5, 1];

let { results } = gaussianElimination({
    coefficients,
    independentTerms,
});
console.log(results);
console.log(
    'Há uma solução (absurda) com o método de Gauss feito pelo computador, mas fazendo à mão não há solução (0a + 0b + 0c = 7).\n',
);

console.log(`Critério de linhas: ${spectralRadius(coefficients)}`);
console.log('O critério de linhas deu maior que 1, o que significa que o método não convergirá.\n');

const precision = 1e-4;

// gaussJacobi({ coefficients, independentTerms, precision });
// gaussSeidel({ coefficients, independentTerms, precision });

console.log('Nenhum dos métodos converge.');

console.log(
    '-------------------------------------------------------------------------------------------------------------------------------------------------',
);

coefficients = [
    [3, -2, 15],
    [9, 2, 3],
    [2, 4, -1],
];
independentTerms = [67, 59, 1];

({ results } = gaussianElimination({
    coefficients,
    independentTerms,
}));
console.log(results);
console.log('Há uma solução exata para esse sistema.\n');

console.log(`Critério de linhas: ${spectralRadius(coefficients)}`);
console.log('O critério de linhas deu maior que 1, portanto os métodos não deveriam convergir.\n');

[results] = gaussJacobi({ coefficients, independentTerms, precision });
console.log(results);
[results] = gaussSeidel({ coefficients, independentTerms, precision });
console.log(results);
console.log('No entanto, eles convergem, e com poucas iterações');

[results] = gaussSeidel({
    coefficients: [
        [9, 2, 3],
        [2, 4, -1],
        [3, -2, 15],
    ],
    independentTerms: [59, 1, 67],
    precision,
});
console.log(results);

console.log(
    'Ao mudar as linhas para já estar com pivoteamento aplicado, o número de iterações dobrou, o critério de linhas aumentou, e a precisão foi ligeiramente pior.',
);
