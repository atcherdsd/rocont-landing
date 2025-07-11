import './styles/main.scss';
import { checkWebp } from './utils/helpers.js';
import SandwichButton from './components/ui/sandwich-button/sandwich-button.js';

checkWebp();

const initApp = () => {  
    new SandwichButton();
};

initApp();
