import { SortingStrategy } from '../core/SortingStrategy.js';
import { DOMUtils } from '../utils/DOMUtils.js';

export class MergeSort extends SortingStrategy {
    async sort(array, visualizer, left = 0, right = array.length - 1) {
        if (left >= right) return;
        const mid = Math.floor((left + right) / 2);

        await this.sort(array, visualizer, left, mid);
        await this.sort(array, visualizer, mid + 1, right);
        await this.merge(array, visualizer, left, mid, right);
    }

    async merge(array, visualizer, left, mid, right) {
        const leftArray = array.slice(left, mid + 1);
        const rightArray = array.slice(mid + 1, right + 1);

        let i = 0, j = 0, k = left;

        while (i < leftArray.length && j < rightArray.length) {
            visualizer.comparisons++;
            
            if (leftArray[i] <= rightArray[j]) {
                array[k] = leftArray[i];
                i++;
            } else {
                array[k] = rightArray[j];
                j++;
            }
            
            DOMUtils.updateBar(k, array[k], 'swapping');
            visualizer.updateStats();
            await visualizer.delay();
            DOMUtils.removeBarClass(k, 'swapping');
            k++;
        }

        while (i < leftArray.length) {
            array[k] = leftArray[i];
            DOMUtils.updateBar(k, array[k]);
            i++;
            k++;
        }

        while (j < rightArray.length) {
            array[k] = rightArray[j];
            DOMUtils.updateBar(k, array[k]);
            j++;
            k++;
        }
    }
}