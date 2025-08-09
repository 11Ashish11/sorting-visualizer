import { SortingStrategy } from '../core/SortingStrategy.js';

export class BubbleSort extends SortingStrategy {
    async sort(array, visualizer) {
        const n = array.length;
        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                if (await visualizer.compare(j, j + 1)) {
                    await visualizer.swap(j, j + 1);
                }
            }
        }
    }
}
