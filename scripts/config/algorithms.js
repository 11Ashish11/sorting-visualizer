export const ALGORITHM_INFO = {
    bubble: {
        name: 'Bubble Sort',
        description: 'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)'
    },
    selection: {
        name: 'Selection Sort',
        description: 'Divides the list into sorted and unsorted regions, repeatedly selecting the minimum element.',
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)'
    },
    insertion: {
        name: 'Insertion Sort',
        description: 'Builds the sorted array one element at a time by inserting each element into its correct position.',
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)'
    },
    merge: {
        name: 'Merge Sort',
        description: 'Divides the array into halves, sorts them recursively, then merges the sorted halves.',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(n)'
    },
    quick: {
        name: 'Quick Sort',
        description: 'Picks a pivot element, partitions the array around it, then recursively sorts sub-arrays.',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(log n)'
    }
};