import { BubbleSort } from './BubbleSort.js';
import { SelectionSort } from './SelectionSort.js';
import { InsertionSort } from './InsertionSort.js';
import { MergeSort } from './MergeSort.js';
import { QuickSort } from './QuickSort.js';

export const SORTING_STRATEGIES = {
    bubble: BubbleSort,
    selection: SelectionSort,
    insertion: InsertionSort,
    merge: MergeSort,
    quick: QuickSort
};