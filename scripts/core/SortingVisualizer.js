// scripts/core/SortingVisualizer.js
import { CONFIG } from '../config/constants.js';
import { ALGORITHM_INFO } from '../config/algorithms.js';
import { SORTING_STRATEGIES } from '../strategies/index.js';
import { DOMUtils } from '../utils/DOMUtils.js';
import { ArrayUtils } from '../utils/ArrayUtils.js';

export class SortingVisualizer {
    constructor() {
        this.array = [];
        this.isRunning = false;
        this.isPaused = false;
        this.speed = CONFIG.DEFAULT_SPEED;
        this.comparisons = 0;
        this.swaps = 0;
        this.startTime = 0;
        this.strategy = null;
        
        this.initializeElements();
        this.initializeEventListeners();
        this.generateRandomArray();
    }
    
    initializeElements() {
        // Get all DOM elements
        this.elements = {
            arrayInput: DOMUtils.getElementById('arrayInput'),
            algorithmSelect: DOMUtils.getElementById('algorithmSelect'),
            startButton: DOMUtils.getElementById('startSort'),
            resetButton: DOMUtils.getElementById('resetArray'),
            pauseButton: DOMUtils.getElementById('pauseResume'),
            generateButton: DOMUtils.getElementById('generateRandom'),
            speedSlider: DOMUtils.getElementById('speedSlider'),
            speedValue: DOMUtils.getElementById('speedValue'),
            arrayContainer: DOMUtils.getElementById('arrayContainer'),
            
            // Stats elements
            comparisonsSpan: DOMUtils.getElementById('comparisons'),
            swapsSpan: DOMUtils.getElementById('swaps'),
            timeSpan: DOMUtils.getElementById('timeElapsed'),
            
            // Info elements
            algorithmName: DOMUtils.getElementById('algorithmName'),
            algorithmDescription: DOMUtils.getElementById('algorithmDescription'),
            timeComplexity: DOMUtils.getElementById('timeComplexity'),
            spaceComplexity: DOMUtils.getElementById('spaceComplexity'),
            
            // Sorted result element
            sortedNumbers: DOMUtils.getElementById('sortedNumbers')
        };

        // Initialize strategy based on default selection
        const initialAlgorithm = this.elements.algorithmSelect.value;
        this.setStrategy(this.createStrategy(initialAlgorithm));
        this.updateAlgorithmInfo();
        this.clearSortedNumbers();
    }

    createStrategy(algorithmKey) {
        const StrategyClass = SORTING_STRATEGIES[algorithmKey];
        return StrategyClass ? new StrategyClass() : null;
    }

    setStrategy(strategy) {
        this.strategy = strategy;
    }
    
    initializeEventListeners() {
        // Control buttons
        this.elements.startButton.addEventListener('click', () => this.startSorting());
        this.elements.resetButton.addEventListener('click', () => this.resetArray());
        this.elements.pauseButton.addEventListener('click', () => this.togglePause());
        this.elements.generateButton.addEventListener('click', () => this.generateRandomArray());
        
        // Speed control
        this.elements.speedSlider.addEventListener('input', (e) => {
            this.speed = parseInt(e.target.value);
            this.elements.speedValue.textContent = e.target.value;
        });
        
        // Array input
        this.elements.arrayInput.addEventListener('input', () => this.parseInputArray());
        
        // Algorithm selection
        this.elements.algorithmSelect.addEventListener('change', () => {
            const selectedAlgorithm = this.elements.algorithmSelect.value;
            this.setStrategy(this.createStrategy(selectedAlgorithm));
            this.updateAlgorithmInfo();
        });
    }
    
    parseInputArray() {
        const input = this.elements.arrayInput.value;
        
        try {
            const parsedArray = ArrayUtils.parseInputArray(input);
            if (parsedArray) {
                this.array = parsedArray;
                this.renderArray();
                this.resetStats();
                this.clearSortedNumbers();
            }
        } catch (error) {
            console.warn('Array parsing error:', error.message);
            // You could show a user-friendly error message here
        }
    }
    
    generateRandomArray() {
        this.array = ArrayUtils.generateRandomArray();
        this.elements.arrayInput.value = this.array.join(', ');
        this.renderArray();
        this.resetStats();
        this.clearSortedNumbers();
    }
    
    renderArray() {
        this.elements.arrayContainer.innerHTML = '';
        this.array.forEach((value, index) => {
            const bar = DOMUtils.createArrayBar(value, index);
            this.elements.arrayContainer.appendChild(bar);
        });
    }
    
    async startSorting() {
        if (this.isRunning || !this.strategy) return;
        
        this.isRunning = true;
        this.startTime = Date.now();
        this.updateButtonStates(true);
        this.resetStats();
        
        try {
            await this.strategy.sort(this.array, this);
        } catch (error) {
            console.log('Sorting interrupted:', error.message);
        }
        
        this.finishSorting();
    }
    
    finishSorting() {
        this.isRunning = false;
        this.isPaused = false;
        this.updateButtonStates(false);
        
        // Mark all bars as sorted
        this.array.forEach((_, index) => {
            DOMUtils.addBarClass(index, CONFIG.ANIMATION_CLASSES.SORTED);
        });
        
        this.updateTimer();
        this.displaySortedNumbers();
    }
    
    updateButtonStates(isRunning) {
        this.elements.startButton.disabled = isRunning;
        this.elements.pauseButton.disabled = !isRunning;
        this.elements.pauseButton.textContent = this.isPaused ? 'Resume' : 'Pause';
    }
    
    resetArray() {
        if (this.isRunning) return;
        
        // Remove all animation classes
        this.array.forEach((_, index) => {
            const bar = DOMUtils.getElementById(`bar-${index}`);
            if (bar) {
                bar.className = 'array-bar';
            }
        });
        
        this.resetStats();
        this.clearSortedNumbers();
    }
    
    resetStats() {
        this.comparisons = 0;
        this.swaps = 0;
        this.startTime = Date.now();
        this.updateStats();
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
        this.updateButtonStates(this.isRunning);
    }
    
    // Animation and timing methods
    async delay() {
        // Wait while paused
        while (this.isPaused) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        // Main delay based on speed
        return new Promise(resolve => 
            setTimeout(resolve, 101 - this.speed)
        );
    }
    
    // Visualization methods used by sorting strategies
    async swap(i, j) {
        if (i === j) return;
        
        // Swap array elements
        [this.array[i], this.array[j]] = [this.array[j], this.array[i]];
        
        // Update visual representation
        DOMUtils.addBarClass(i, CONFIG.ANIMATION_CLASSES.SWAPPING);
        DOMUtils.addBarClass(j, CONFIG.ANIMATION_CLASSES.SWAPPING);
        
        DOMUtils.updateBar(i, this.array[i]);
        DOMUtils.updateBar(j, this.array[j]);
        
        this.swaps++;
        this.updateStats();
        await this.delay();
        
        DOMUtils.removeBarClass(i, CONFIG.ANIMATION_CLASSES.SWAPPING);
        DOMUtils.removeBarClass(j, CONFIG.ANIMATION_CLASSES.SWAPPING);
    }
    
    async compare(i, j) {
        // Add visual comparison indicator
        DOMUtils.addBarClass(i, CONFIG.ANIMATION_CLASSES.COMPARING);
        DOMUtils.addBarClass(j, CONFIG.ANIMATION_CLASSES.COMPARING);
        
        this.comparisons++;
        this.updateStats();
        await this.delay();
        
        DOMUtils.removeBarClass(i, CONFIG.ANIMATION_CLASSES.COMPARING);
        DOMUtils.removeBarClass(j, CONFIG.ANIMATION_CLASSES.COMPARING);
        
        return this.array[i] > this.array[j];
    }
    
    // Statistics and UI updates
    updateStats() {
        this.elements.comparisonsSpan.textContent = this.comparisons;
        this.elements.swapsSpan.textContent = this.swaps;
        this.updateTimer();
    }
    
    updateTimer() {
        const elapsed = Date.now() - this.startTime;
        this.elements.timeSpan.textContent = `${elapsed}ms`;
    }
    
    updateAlgorithmInfo() {
        const algorithm = this.elements.algorithmSelect.value;
        const info = ALGORITHM_INFO[algorithm];
        
        if (info) {
            this.elements.algorithmName.textContent = info.name;
            this.elements.algorithmDescription.textContent = info.description;
            this.elements.timeComplexity.textContent = info.timeComplexity;
            this.elements.spaceComplexity.textContent = info.spaceComplexity;
        }
    }

    // Public methods for strategies to use
    markAsPivot(index) {
        DOMUtils.addBarClass(index, CONFIG.ANIMATION_CLASSES.PIVOT);
    }

    removePivotMark(index) {
        DOMUtils.removeBarClass(index, CONFIG.ANIMATION_CLASSES.PIVOT);
    }

    updateBarValue(index, value) {
        this.array[index] = value;
        DOMUtils.updateBar(index, value);
    }

    // Sorted numbers display methods
    displaySortedNumbers() {
        const sortedContainer = this.elements.sortedNumbers;
        sortedContainer.innerHTML = '';
        sortedContainer.classList.remove('empty');
        sortedContainer.classList.add('populated');
        
        // Create individual number elements with animation delay
        this.array.forEach((number, index) => {
            setTimeout(() => {
                const numberElement = document.createElement('span');
                numberElement.className = 'number';
                numberElement.textContent = number;
                sortedContainer.appendChild(numberElement);
                
                // Add comma separator except for last element
                if (index < this.array.length - 1) {
                    const separator = document.createElement('span');
                    separator.textContent = ', ';
                    separator.style.color = '#28a745';
                    separator.style.fontWeight = 'bold';
                    sortedContainer.appendChild(separator);
                }
            }, index * 100); // Stagger the animation
        });
    }

    clearSortedNumbers() {
        const sortedContainer = this.elements.sortedNumbers;
        sortedContainer.innerHTML = 'Array will appear here after sorting...';
        sortedContainer.classList.add('empty');
        sortedContainer.classList.remove('populated');
    }
}