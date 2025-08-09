import { SortingStrategy } from '../core/SortingStrategy.js';

export class InsertionSort extends SortingStrategy {
    async sort(array, visualizer) {
        const n = array.length;
        for (let i = 1; i < n; i++) {
            let j = i;
            while (j > 0 && await visualizer.compare(j - 1, j)) {
                await visualizer.swap(j - 1, j);
                j--;
            }
        }
    }
}