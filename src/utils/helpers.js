import { BREAKPOINTS } from './variables.js';

export const checkWebp = () => {
    if (document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0) {
        document.documentElement.classList.add('-webp');
    }
}

export const isMobile = () => window.innerWidth <= BREAKPOINTS.LG;

export function debounce(fn, delay = 250) {
    let timeout;

    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), delay);
    };
}

/**
 * Простая задержка на заданное количество миллисекунд.
 * @param {number} ms - сколько миллисекунд ждать
 * @returns {Promise<void>}
 */
export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
