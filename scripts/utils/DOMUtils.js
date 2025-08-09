import { CONFIG } from '../config/constants.js';

export class DOMUtils {
    static updateBar(index, value, className = null) {
        const bar = document.getElementById(`bar-${index}`);
        if (bar) {
            bar.style.height = `${value * CONFIG.BAR_HEIGHT_MULTIPLIER}px`;
            bar.textContent = value;
            if (className) {
                bar.classList.add(className);
            }
        }
    }

    static addBarClass(index, className) {
        const bar = document.getElementById(`bar-${index}`);
        if (bar) {
            bar.classList.add(className);
        }
    }

    static removeBarClass(index, className) {
        const bar = document.getElementById(`bar-${index}`);
        if (bar) {
            bar.classList.remove(className);
        }
    }

    static getElementById(id) {
        return document.getElementById(id);
    }

    static createArrayBar(value, index) {
        const bar = document.createElement('div');
        bar.className = 'array-bar';
        bar.style.height = `${value * CONFIG.BAR_HEIGHT_MULTIPLIER}px`;
        bar.textContent = value;
        bar.id = `bar-${index}`;
        return bar;
    }
}