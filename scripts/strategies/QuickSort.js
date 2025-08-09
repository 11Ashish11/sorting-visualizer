import { SortingStrategy } from '../core/SortingStrategy.js';

export class QuickSort extends SortingStrategy {
    async sort(array, visualizer, low = 0, high = array.length - 1) {
        if (low < high) {
            const pivotIndex = await this.partition(array, visualizer, low, high);
            await this.sort(array, visualizer, low, pivotIndex - 1);
            await this.sort(array, visualizer, pivotIndex + 1, high);
        }
    }
    async partition(array, visualizer, low, high) {
        const pivot = array[high];
        const pivotBar = document.getElementById(`bar-${high}`);
        pivotBar.classList.add('pivot');        
        let i = low - 1;        
        for (let j = low; j < high; j++) {
            if (await visualizer.compare(high, j)) {
                i++;
                if (i !== j) {
                    await visualizer.swap(i, j);
                }
            }
        }
        await visualizer.swap(i + 1, high);
        pivotBar.classList.remove('pivot');
        return i + 1;
    }
}