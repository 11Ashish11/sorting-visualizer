import { CONFIG } from '../config/constants.js';

export class ArrayUtils {
    static generateRandomArray(size = null) {
        const { min, max } = CONFIG.DEFAULT_ARRAY_SIZE_RANGE;
        const arraySize = size || Math.floor(Math.random() * (max - min + 1)) + min;
        
        return Array.from({ length: arraySize }, () => 
            Math.floor(Math.random() * (CONFIG.MAX_BAR_VALUE - 10)) + 10
        );
    }

    static parseInputArray(input) {
        if (!input.trim()) return null;
        
        try {
            const numbers = input.split(',').map(num => {
                const parsed = parseInt(num.trim());
                if (isNaN(parsed)) throw new Error('Invalid number');
                return Math.max(CONFIG.MIN_BAR_VALUE, Math.min(CONFIG.MAX_BAR_VALUE, parsed));
            });
            
            if (numbers.length > CONFIG.MAX_ARRAY_SIZE) {
                throw new Error(`Maximum ${CONFIG.MAX_ARRAY_SIZE} numbers allowed`);
            }
            
            return numbers;
        } catch (error) {
            throw new Error('Invalid input format');
        }
    }

    static validateArray(array) {
        return Array.isArray(array) && 
               array.length > 0 && 
               array.length <= CONFIG.MAX_ARRAY_SIZE &&
               array.every(num => 
                   typeof num === 'number' && 
                   num >= CONFIG.MIN_BAR_VALUE && 
                   num <= CONFIG.MAX_BAR_VALUE
               );
    }
}
