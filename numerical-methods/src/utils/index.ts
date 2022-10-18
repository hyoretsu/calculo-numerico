/**
 * Fixes an error that happens sometimes when you're working with numbers.
 */
export const fixNumber = (number: number): number => {
    return Number(number.toPrecision(12));
};

/**
 * @param	start - A number specifying at which position to start. Default is 0.
 * When called alone, it acts like `range(stop)`
 * @param	stop - A number specifying at which position to stop (not included).
 * @param	step	- An integer number specifying the incrementation. Default is 1.
 */
export const range = (start: number, stop = 0, step = 1): number[] => {
    // With a single parameter, it'll act like range(stop), but with two/three it becomes range(start, stop)
    if (stop === 0) {
        stop = start;
        start = 0;
    }

    if (step === 0) {
        throw new Error("The range doesn't exist. (step = 0)");
    }
    if (start === stop) {
        throw new Error("The range doesn't exist, start and stop values are the same.");
    }
    // Reverse range with normal step or normal range with reverse step
    if ((start > stop && step > 0) || (start < stop && step < 0)) {
        throw new Error("The range doesn't exist, it would stop before starting.");
    }

    const length = Math.ceil((stop - start) / step);

    return Array.from({ length }, (_, index) => start + step * index);
};

/**
 * Swaps the elements of an array at the two given indexes.
 */
export const swap = (array: any[], firstIndex: number, secondIndex: number): any[] => {
    const temp = array[firstIndex];
    array[firstIndex] = array[secondIndex];
    array[secondIndex] = temp;

    return array;
};
