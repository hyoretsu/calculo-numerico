import { bisection, falsePosition } from 'numerical-methods';

let func = 'x^3 - 9x + 3';
let interval: [number, number];
let precision = 1e-4;

console.log(
    'Considere a função x³ - 9x + 3, procure os dois zeros em [0, 3] com bisseção e falsa posição, qual método resulta ser melhor?\n',
);

interval = [0, 1];
console.log('Primeira raíz');
console.log('Bisseção', bisection({ func, interval, precision })[0]);
console.log('Falsa posição', falsePosition({ func, interval, precision })[0]);

console.log();

interval = [2.5, 3];
console.log('Segunda raíz');
console.log('Bisseção', bisection({ func, interval, precision })[0]);
console.log('Falsa posição', falsePosition({ func, interval, precision })[0]);

console.log();
console.log(
    'No primeiro intervalo, a bisseção foi mais de 50% mais rápida em cumprir uma das condições, apesar de ter um intervalo maior. Enquanto que no segundo intervalo, a falsa posição foi 40% mais rápida, apesar de ter um intervalo maior.',
);

console.log(
    '-------------------------------------------------------------------------------------------------------------------------------------------------',
);

console.log(
    'A concentração, c, de uma bactéria poluente em um lago é descrita pela seguinte função: c = 70 * e⁻¹‧⁵ᵗ + 2.5 * e⁻⁰‧⁰⁷⁵ᵗ. Utilize o método da bisseção e falsa posição, com precisão 0.050 e um máximo de 5 iterações, para estimar o tempo t, em segundos, para que esta concentração seja reduzida para 9.\n',
);

func = '70 * e^(-1.5x) + 2.5 * e^(-0.075x) - 9';
interval = [1, 2];
precision = 5e-2;

console.log('Bisseção', bisection({ func, interval, precision, options: { maxIterations: 5 } })[0]);
console.log(
    'Falsa posição',
    bisection({ func, interval, precision, options: { maxIterations: 5 } })[0],
);

console.log();
console.log(
    'Ambos os métodos acharam o mesmo intervalo com a precisão fornecida no mesmo número de iterações',
);
