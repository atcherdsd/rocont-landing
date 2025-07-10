export default class SandwichButton {
    constructor() {
        this.button = document.querySelector('.sandwich-button');

        if (!this.button) return;

        this.button.addEventListener('click', this.onClick);
    }

    onClick = () => {
        this.button.classList.toggle('-opened');
    }
}
