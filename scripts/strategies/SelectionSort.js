import { SortingStrategy } from '../core/SortingStrategy.js';

export class SelectionSort extends SortingStrategy {
    async sort(array, visualizer) {
        const n = array.length;
        for (let i = 0; i < n - 1; i++) {
            let minIndex = i;
            for (let j = i + 1; j < n; j++) {
                if (await visualizer.compare(minIndex, j)) {
                    minIndex = j;
                }
            }
            if (minIndex !== i) {
                await visualizer.swap(i, minIndex);
            }
        }
    }
}