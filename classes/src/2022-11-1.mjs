import { simpsonRule13, trapezoidalRule } from 'numerical-methods';

let error, func, result, x;

func = '(1 + x^2)^(-1/2)';
x = [0, 4];

({ result, error } = trapezoidalRule({ pointN: 2, func, x }));
console.log(`2 pontos: ${result}`);
({ result, error } = trapezoidalRule({ pointN: 3, func, x }));
console.log(`3 pontos: ${result}`);
({ result, error } = trapezoidalRule({ pointN: 9, func, x }));
console.log(`9 pontos: ${result} ${error}`);

console.log(
    '-------------------------------------------------------------------------------------------------------------------------------------------------',
);

const pointN = 10;
func = 'e^x';
x = [0, 1];

({ result } = trapezoidalRule({ pointN, func, x }));
console.log(`Regra do trapézio repetida, 10 pontos: ${result}`);
({ result } = simpsonRule13({ pointN, func, x }));
console.log(`Regra 1/3 de Simpson repetida, 10 pontos: ${result}`);
