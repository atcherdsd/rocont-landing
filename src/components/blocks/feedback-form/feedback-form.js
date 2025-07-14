import pageData from '@/assets/data/index.json';
import { delay } from '@/utils/helpers.js';
import { API_URL } from '@/utils/variables.js';

export default class FeedbackForm {
    static classNames = {
        visible: '-visible',
        loading: '-loading',
        success: '-success',
        error: '-error'
    };

    constructor(form) {
        this.baseMessages = pageData.validationMessages;
        this.serverMessage = pageData.serverMessage;
        this.sendMessage = pageData.sendMessage;

        this.form = form;
        this.inputs = Array.from(form.querySelectorAll('input'));
        this.errorContainers = form.querySelectorAll('.error');
        this.submitBtn = form.querySelector('button[type="submit"]');
        this._initialButtonText = this.submitBtn.querySelector('.text').textContent;

        this._onSubmit = (e) => this.onSubmit(e);
        this.form.addEventListener('submit', this._onSubmit);
        
        this._handlers = new Map();

        this.inputs.forEach((input) => {
            const onInput = () => {
                this.validateField(input);
                this.updateSubmitState();
            };
            const onBlur = () => {
                this.validateField(input);
                this.updateSubmitState();
            };

            this._handlers.set(input, { onInput, onBlur });

            if (input.type === 'tel' || input.type === 'text') {
                input.addEventListener('blur', onBlur);
            } else {
                input.addEventListener('input', onInput);
            }
        });
    }

    onSubmit(e) {
        e.preventDefault();
        this.clearErrors();

        let valid = true;
        for (let input of this.inputs) {
            if (!this.validateField(input)) {
                valid = false;
            }
        }

        this.updateSubmitState();

        if (valid) {
            this.submit();
        }
    }

    validateField(input) {
        const m = this.baseMessages;
        const digits = (input.value.match(/\d/g) || []);

        input.setCustomValidity('');

        if (input.validity.valueMissing) {
            input.setCustomValidity(m.required);
        } else if (input.value.length > 0 && input.value.trim().length === 0) {
            input.setCustomValidity(m.onlySpaces);
        } else if (input.type === 'tel') {
            if (input.validity.patternMismatch) {
                input.setCustomValidity(input.dataset.patternMessage || m.invalidFormat);
            } else if (digits.length < 7) {
                input.setCustomValidity(m.minDigits);
            }

        } else if (!input.validity.valid) {
            if (input.validity.patternMismatch) {
                input.setCustomValidity(input.dataset.patternMessage || m.invalidFormat);
            }
            else if (input.validity.typeMismatch) {
                input.setCustomValidity(m.invalidType);
            }
        }

        const errorContainer = this.form.querySelector(`.error[data-for="${input.name}"]`);

        if (!input.checkValidity()) {
            errorContainer.textContent = input.validationMessage;
            errorContainer.classList.add(FeedbackForm.classNames.visible);
            return false;
        } else {
            errorContainer.textContent = '';
            errorContainer.classList.remove(FeedbackForm.classNames.visible);
            return true;
        }
    }

    updateSubmitState() {
        const formIsValid = this.form.checkValidity();
        this.submitBtn.disabled = !formIsValid;
    }

    clearErrors() {
        this.errorContainers.forEach((el) => {
            el.textContent = '';
            el.classList.remove(FeedbackForm.classNames.visible);
        });
    }

    async submit() {
        const formData = new FormData(this.form);

        const payload = Object.fromEntries(
            Array.from(formData.entries()).map(([key, value]) => [
                key,
                typeof value === 'string' ? value.trim() : value
            ])
        );

        this.toggleLoading(true);
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify(payload),
            });

            await delay(2000);

            if (!response.ok) throw new Error(response.statusText);
            this.onRequestSuccess({ message: this.serverMessage });
        } catch (e) {
            this.onRequestError(e);
        } finally {
            this.toggleLoading(false);
        }
    }

    toggleLoading(isLoading) {
        this.submitBtn.disabled = isLoading;
        this.submitBtn.classList.toggle(FeedbackForm.classNames.loading, isLoading);

        const textEl = this.submitBtn.querySelector('.text');
        if (isLoading) {
            textEl.textContent = this.sendMessage.send;
        }        
    }

    onRequestSuccess = ({ message }) => {
        this.form.reset();
        this.clearErrors();

        const textEl = this.submitBtn.querySelector('.text');
        textEl.textContent = message;
        this.submitBtn.classList.add(FeedbackForm.classNames.success);
        setTimeout(() => {
            textEl.textContent = this._initialButtonText;
            this.submitBtn.classList.remove(FeedbackForm.classNames.success);
        }, 2000);
    };

    onRequestError(error) {
        console.error('Ошибка формы:', error);

        const textEl = this.submitBtn.querySelector('.text');
        textEl.textContent = this.sendMessage.sendError;

        this.submitBtn.classList.add(FeedbackForm.classNames.error);
        setTimeout(() => {
            textEl.textContent = this._initialButtonText;
            this.submitBtn.classList.remove(FeedbackForm.classNames.error);
        }, 3000);
    }

    destroy() {
        this.form.removeEventListener('submit', this._onSubmit);
        this.inputs.forEach((input) => {
            const handler = this._handlers.get(input);
            if (!handler) return;
            input.removeEventListener('input', handler.onInput);
            input.removeEventListener('blur', handler.onBlur);
        });
        this._handlers.clear();
    }
}
