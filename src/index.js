import './styles/main.scss';
import { checkWebp } from './utils/helpers.js';
import SandwichButton from './components/ui/sandwich-button/sandwich-button.js';
import FeedbackForm from './components/blocks/feedback-form/feedback-form.js';

checkWebp();

const initApp = () => {  
    new SandwichButton();

    const mainSlider = document.querySelector('.main-slider');
  
    if (mainSlider) {
        const observer = new IntersectionObserver((entries, observer) => {
            const entry = entries[0];
            if (entry.isIntersecting) {
                import('./components/blocks/main-slider/main-slider.js').then((module) => {
                    const MainSlider = module.default;
                    const mainSliderComponent = new MainSlider(mainSlider);
                    mainSliderComponent.init();
                });
        
                observer.unobserve(mainSlider);
            }
        }, {
            rootMargin: '0px 0px 200px 0px',
        });
    
      observer.observe(mainSlider);
    }

    const feedbackForm = document.querySelector('.feedback-form');
    if (feedbackForm) new FeedbackForm(feedbackForm);
};

initApp();
