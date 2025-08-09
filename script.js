class SortingVisualizer {
    constructor() {
        this.array = [];
        this.isRunning = false;
        this.isPaused = false;
        this.speed = 50;
        this.comparisons = 0;
        this.swaps = 0;
        this.startTime = 0;
        this.strategy = null;
        
        this.initializeElements();
        this.initializeEventListeners();
        this.generateRandomArray();
    }
    
    initializeElements() {
        this.arrayInput = document.getElementById('arrayInput');
        this.algorithmSelect = document.getElementById('algorithmSelect');
        this.startButton = document.getElementById('startSort');
        this.resetButton = document.getElementById('resetArray');
        this.pauseButton = document.getElementById('pauseResume');
        this.generateButton = document.getElementById('generateRandom');
        this.speedSlider = document.getElementById('speedSlider');
        this.speedValue = document.getElementById('speedValue');
        this.arrayContainer = document.getElementById('arrayContainer');
        this.comparisonsSpan = document.getElementById('comparisons');
        this.swapsSpan = document.getElementById('swaps');
        this.timeSpan = document.getElementById('timeElapsed');
        this.algorithmName = document.getElementById('algorithmName');
        this.algorithmDescription = document.getElementById('algorithmDescription');
        this.timeComplexity = document.getElementById('timeComplexity');
        this.spaceComplexity = document.getElementById('spaceComplexity');

        const val = this.algorithmSelect.value;
        this.setStrategy(this.getStrategyFromValue(val));
    }

    getStrategyFromValue(val) {
    switch (val) {
        case 'bubble': return new BubbleSort();
        case 'selection': return new SelectionSort();
        case 'insertion': return new InsertionSort();
        case 'merge': return new MergeSort(0, this.array.length - 1);
        case 'quick': return new QuickSort(0, this.array.length - 1);
    }
}
    
    initializeEventListeners() {
        this.startButton.addEventListener('click', () => this.startSorting());
        this.resetButton.addEventListener('click', () => this.resetArray());
        this.pauseButton.addEventListener('click', () => this.togglePause());
        this.generateButton.addEventListener('click', () => this.generateRandomArray());
        this.speedSlider.addEventListener('input', (e) => {
            this.speed = e.target.value;
            this.speedValue.textContent = e.target.value;
        });
        // this.algorithmSelect.addEventListener('change', () => this.updateAlgorithmInfo());
        this.arrayInput.addEventListener('input', () => this.parseInputArray());


        this.algorithmSelect.addEventListener('change', () => {
        this.setStrategy(this.getStrategyFromValue(this.algorithmSelect.value));
        this.updateAlgorithmInfo();
    });
    }

    setStrategy(strategy) {
        this.strategy = strategy;
    }
    
    parseInputArray() {
        const input = this.arrayInput.value.trim();
        if (!input) return;
        
        try {
            const numbers = input.split(',').map(num => {
                const parsed = parseInt(num.trim());
                if (isNaN(parsed)) throw new Error('Invalid number');
                return Math.max(1, Math.min(100, parsed));
            });
            
            if (numbers.length > 20) {
                alert('Please enter maximum 20 numbers');
                return;
            }
            
            this.array = numbers;
            this.renderArray();
            this.resetStats();
        } catch (error) {
            console.log('Invalid input format');
        }
    }
    
    generateRandomArray() {
        const size = Math.floor(Math.random() * 10) + 8;
        this.array = Array.from({ length: size }, () => 
            Math.floor(Math.random() * 80) + 10
        );
        this.arrayInput.value = this.array.join(', ');
        this.renderArray();
        this.resetStats();
    }
    
    renderArray() {
        this.arrayContainer.innerHTML = '';
        this.array.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.className = 'array-bar';
            bar.style.height = `${value * 3}px`;
            bar.textContent = value;
            bar.id = `bar-${index}`;
            this.arrayContainer.appendChild(bar);
        });
    }
    
    async startSorting() {
        if (this.isRunning || !this.strategy) return;
        
        this.isRunning = true;
        this.startTime = Date.now();
        this.startButton.disabled = true;
        this.pauseButton.disabled = false;
        this.resetStats();
        
        const algorithm = this.algorithmSelect.value;

        try {
            console.log("Starting sorting with strategy:", this.strategy);
            await this.strategy.sort(this.array, this);
        } catch (error) {
            console.log("Sorting stopped", error);
        }
        
        this.finishSorting();
    }
    
    finishSorting() {
        this.isRunning = false;
        this.isPaused = false;
        this.startButton.disabled = false;
        this.pauseButton.disabled = true;
        this.pauseButton.textContent = 'Pause';
        
        this.array.forEach((_, index) => {
            document.getElementById(`bar-${index}`).classList.add('sorted');
        });
        
        this.updateTimer();
    }
    
    resetArray() {
        if (this.isRunning) return;
        
        this.array.forEach((_, index) => {
            const bar = document.getElementById(`bar-${index}`);
            bar.className = 'array-bar';
        });
        
        this.resetStats();
    }
    
    resetStats() {
        this.comparisons = 0;
        this.swaps = 0;
        this.startTime = Date.now();
        this.updateStats();
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
        this.pauseButton.textContent = this.isPaused ? 'Resume' : 'Pause';
    }
    
    async delay() {
        while (this.isPaused) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return new Promise(resolve => setTimeout(resolve, 101 - this.speed));
    }
    
    async swap(i, j) {
        if (i === j) return;
        
        [this.array[i], this.array[j]] = [this.array[j], this.array[i]];
        
        const bar1 = document.getElementById(`bar-${i}`);
        const bar2 = document.getElementById(`bar-${j}`);
        
        bar1.classList.add('swapping');
        bar2.classList.add('swapping');
        
        bar1.style.height = `${this.array[i] * 3}px`;
        bar1.textContent = this.array[i];
        bar2.style.height = `${this.array[j] * 3}px`;
        bar2.textContent = this.array[j];
        
        this.swaps++;
        this.updateStats();
        await this.delay();
        
        bar1.classList.remove('swapping');
        bar2.classList.remove('swapping');
    }
    
    async compare(i, j) {
        const bar1 = document.getElementById(`bar-${i}`);
        const bar2 = document.getElementById(`bar-${j}`);
        
        bar1.classList.add('comparing');
        bar2.classList.add('comparing');
        
        this.comparisons++;
        this.updateStats();
        await this.delay();
        
        bar1.classList.remove('comparing');
        bar2.classList.remove('comparing');
        
        return this.array[i] > this.array[j];
    }
    
    updateStats() {
        this.comparisonsSpan.textContent = this.comparisons;
        this.swapsSpan.textContent = this.swaps;
        this.updateTimer();
    }
    
    updateTimer() {
        const elapsed = Date.now() - this.startTime;
        this.timeSpan.textContent = `${elapsed}ms`;
    }
    
    updateAlgorithmInfo() {
        const algorithm = this.algorithmSelect.value;
        const info = {
            bubble: {
                name: 'Bubble Sort',
                description: 'Bubble Sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
                timeComplexity: 'O(n²)',
                spaceComplexity: 'O(1)'
            },
            selection: {
                name: 'Selection Sort',
                description: 'Selection Sort divides the list into sorted and unsorted regions, repeatedly selecting the minimum element from the unsorted region.',
                timeComplexity: 'O(n²)',
                spaceComplexity: 'O(1)'
            },
            insertion: {
                name: 'Insertion Sort',
                description: 'Insertion Sort builds the sorted array one element at a time by repeatedly taking an element and inserting it into its correct position.',
                timeComplexity: 'O(n²)',
                spaceComplexity: 'O(1)'
            },
            merge: {
                name: 'Merge Sort',
                description: 'Merge Sort divides the array into two halves, sorts them recursively, and then merges the sorted halves back together.',
                timeComplexity: 'O(n log n)',
                spaceComplexity: 'O(n)'
            },
            quick: {
                name: 'Quick Sort',
                description: 'Quick Sort picks a pivot element and partitions the array around it, then recursively sorts the sub-arrays.',
                timeComplexity: 'O(n log n)',
                spaceComplexity: 'O(log n)'
            }
        };
        
        const current = info[algorithm];
        this.algorithmName.textContent = current.name;
        this.algorithmDescription.textContent = current.description;
        this.timeComplexity.textContent = current.timeComplexity;
        this.spaceComplexity.textContent = current.spaceComplexity;
    }
    
    async bubbleSort() {
        const n = this.array.length;
        
        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                if (await this.compare(j, j + 1)) {
                    await this.swap(j, j + 1);
                }
            }
        }
    }
    
    async selectionSort() {
        const n = this.array.length;
        
        for (let i = 0; i < n - 1; i++) {
            let minIndex = i;
            
            for (let j = i + 1; j < n; j++) {
                if (await this.compare(minIndex, j)) {
                    minIndex = j;
                }
            }
            
            if (minIndex !== i) {
                await this.swap(i, minIndex);
            }
        }
    }
    
    async insertionSort() {
        const n = this.array.length;
        
        for (let i = 1; i < n; i++) {
            let j = i;
            while (j > 0 && await this.compare(j - 1, j)) {
                await this.swap(j - 1, j);
                j--;
            }
        }
    }
    
    async mergeSort(left, right) {
        if (left >= right) return;
        
        const mid = Math.floor((left + right) / 2);
        await this.mergeSort(left, mid);
        await this.mergeSort(mid + 1, right);
        await this.merge(left, mid, right);
    }
    
    async merge(left, mid, right) {
        const leftArray = this.array.slice(left, mid + 1);
        const rightArray = this.array.slice(mid + 1, right + 1);
        
        let i = 0, j = 0, k = left;
        
        while (i < leftArray.length && j < rightArray.length) {
            this.comparisons++;
            this.updateStats();
            
            if (leftArray[i] <= rightArray[j]) {
                this.array[k] = leftArray[i];
                i++;
            } else {
                this.array[k] = rightArray[j];
                j++;
            }
            
            const bar = document.getElementById(`bar-${k}`);
            bar.style.height = `${this.array[k] * 3}px`;
            bar.textContent = this.array[k];
            bar.classList.add('swapping');
            
            await this.delay();
            bar.classList.remove('swapping');
            k++;
        }
        
        while (i < leftArray.length) {
            this.array[k] = leftArray[i];
            const bar = document.getElementById(`bar-${k}`);
            bar.style.height = `${this.array[k] * 3}px`;
            bar.textContent = this.array[k];
            i++;
            k++;
        }
        
        while (j < rightArray.length) {
            this.array[k] = rightArray[j];
            const bar = document.getElementById(`bar-${k}`);
            bar.style.height = `${this.array[k] * 3}px`;
            bar.textContent = this.array[k];
            j++;
            k++;
        }
    }
    
    async quickSort(low, high) {
        if (low < high) {
            const pivotIndex = await this.partition(low, high);
            await this.quickSort(low, pivotIndex - 1);
            await this.quickSort(pivotIndex + 1, high);
        }
    }
    
    async partition(low, high) {
        const pivot = this.array[high];
        const pivotBar = document.getElementById(`bar-${high}`);
        pivotBar.classList.add('pivot');
        
        let i = low - 1;
        
        for (let j = low; j < high; j++) {
            if (await this.compare(high, j)) {
                i++;
                if (i !== j) {
                    await this.swap(i, j);
                }
            }
        }
        
        await this.swap(i + 1, high);
        pivotBar.classList.remove('pivot');
        
        return i + 1;
    }
}


class SortingStrategy {
    async sort(array, visualizer) {
        throw new Error("sort() must be implemented");
    }
}

class BubbleSort extends SortingStrategy {
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

class SelectionSort extends SortingStrategy {
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
class InsertionSort extends SortingStrategy {
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


class MergeSort extends SortingStrategy {
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
            // Compare the actual values, not indices
            visualizer.comparisons++;
            
            if (leftArray[i] <= rightArray[j]) {
                array[k] = leftArray[i];
                i++;
            } else {
                array[k] = rightArray[j];
                j++;
            }
            
            // Update the visual representation
            const bar = document.getElementById(`bar-${k}`);
            if (bar) {
                bar.style.height = `${array[k] * 3}px`;
                bar.textContent = array[k];
                bar.classList.add('swapping');
            }
            
            visualizer.updateStats();
            await visualizer.delay();
            
            if (bar) {
                bar.classList.remove('swapping');
            }
            
            k++;
        }

        // Copy remaining elements from leftArray
        while (i < leftArray.length) {
            array[k] = leftArray[i];
            
            const bar = document.getElementById(`bar-${k}`);
            if (bar) {
                bar.style.height = `${array[k] * 3}px`;
                bar.textContent = array[k];
            }
            
            i++;
            k++;
        }

        // Copy remaining elements from rightArray
        while (j < rightArray.length) {
            array[k] = rightArray[j];
            
            const bar = document.getElementById(`bar-${k}`);
            if (bar) {
                bar.style.height = `${array[k] * 3}px`;
                bar.textContent = array[k];
            }
            
            j++;
            k++;
        }
    }
}


class QuickSort extends SortingStrategy {
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





document.addEventListener('DOMContentLoaded', () => {
    new SortingVisualizer();
});