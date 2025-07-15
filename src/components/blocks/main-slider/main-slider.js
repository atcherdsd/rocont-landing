import Slider from '../slider/slider.js';
import { isMobile, debounce } from '../../../utils/helpers.js';

export default class MainSlider {
    constructor(container) {
        this.container = container;
        this.slider = null;
        this.observer = null;
        this.delay = isMobile() ? 150 : 50;
    }

    init() {
        if (!this.container) return;

        this.observe();

        this.checkVisibility();
        window.addEventListener('scroll', this.checkVisibility);
    }

    observe() {
        this.observer = new IntersectionObserver(this.handleIntersect, {
            rootMargin: '0px 0px -20% 0px',
            threshold: 0.2,
        });
    
        this.observer.observe(this.container);
    }

    handleIntersect = (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                this.handleVisible();
            }
        });
    }

    checkVisibility = debounce(() => {
        const rect = this.container.getBoundingClientRect();
        if (rect.top > window.innerHeight * 1.5) {
            return;
        }
        if (rect.top < window.innerHeight && !this.container.classList.contains('-visible')) {
            this.handleVisible();
        }
    }, this.delay);

    handleVisible = () => {
        this.initSlider();
        this.container.classList.add('-visible');
        this.observer?.disconnect();
        window.removeEventListener('scroll', this.checkVisibility);
    }

    initSlider() {
        this.slider = new Slider(this.container, {
            slidesPerView: 'auto',
            spaceBetween: 8,
            navigation: {
                prevEl: document.querySelector('.-prev'),
                nextEl: document.querySelector('.-next'),
            },
        });
    }
}
