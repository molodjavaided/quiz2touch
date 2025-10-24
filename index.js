document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('quizForm');
    const steps = document.querySelectorAll('.quiz-step');
    const startBtn = document.getElementById('startBtn');
    const nextBtn = document.getElementById('nextBtn');
    const showStyleBtn = document.getElementById('showStyleBtn');
    const backToStyleBtn = document.getElementById('backToStyleBtn');
    const selectedStyleName = document.getElementById('selected-style-name');
    const buttonsFooter = document.querySelector('.buttons-form__footer');
    const prevBtn = document.getElementById('prevBtn');
    const currentCounterPagination = document.getElementById('current-counter');
    const totalCounterPagination = document.getElementById('total-counter');

    let currentStep = 0;
    let selectedStyle = null;

    const initializeMultipleChoiceButtons = () => {
        const multipleChoiceButtons = document.querySelectorAll('.button-answer:not([data-style-id])');
        multipleChoiceButtons.forEach(button => {
            button.addEventListener('click', function() {
                this.classList.toggle('active');
                updatePagination();
            });
        });
    }

    const collectMultipleChoiceData = (formData) => {
        const selectedButtons = document.querySelectorAll('.button-answer.active:not(.quiz-step__choose_style .button-answer)');
        const groupedData = {};

        selectedButtons.forEach(button => {
            const groupName = button.getAttribute('name');
            const value = button.getAttribute('value');
            if (!groupedData[groupName]) {
                groupedData[groupName] = [];
            }
            groupedData[groupName].push(value);
        });

        Object.keys(groupedData).forEach(groupName => {
            formData.append(groupName, groupedData[groupName].join(','));
        });
    }

    const validateStep = (stepIndex) => {
        const currentStepElement = steps[stepIndex];
        const inputs = currentStepElement.querySelectorAll('input[required]');
        let isValid = true;

        inputs.forEach(input => {
            input.style.borderColor = '#f6b715';
        });

        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = '#ff4444';
                isValid = false;
            }
        });

        return isValid;
    }

    const showStep = (stepIndex) => {
        steps.forEach((step, index) => {
            step.hidden = index !== stepIndex;
        });

        if (stepIndex === 0 || stepIndex === 11 ) {
            buttonsFooter.classList.add('hidden');
        } else {
            buttonsFooter.classList.remove('hidden');
        }

        if (stepIndex === 0) {
            nextBtn.hidden = true;
            showStyleBtn.hidden = true;
            prevBtn.hidden = true;
            backToStyleBtn.hidden = true;
        } else if (stepIndex === 1) {
            nextBtn.hidden = false;
            prevBtn.hidden = true;
            showStyleBtn.hidden = !selectedStyle;
            backToStyleBtn.hidden = true;
        } else if (stepIndex === 2) {
            nextBtn.hidden = false;
            showStyleBtn.hidden = true;
            prevBtn.hidden = true;
            backToStyleBtn.hidden = false;
        } else {
            nextBtn.hidden = false;
            showStyleBtn.hidden = true;
            prevBtn.hidden = false;
            backToStyleBtn.hidden = true;
        }

        updateNextButton();
        updatePagination()
    }

    const counterFilledInputs = () => {
        let filledInputs = 0;

        for (let i = 3; i <+ 10; i++) {
            const step = document.querySelector(`.quiz-step[data-step="${i}"]`)
            if (step) {
                const inputs = step.querySelectorAll('input[type="text"]');
                inputs.forEach(input => {
                    if (input.value.trim() !== "") {
                        filledInputs++;
                    }
                })
            }
        }

        const styleSelected = document.querySelector('.quiz-step__choose_style .button-answer.active');
        if (styleSelected) {
            filledInputs++;
        }

        const multipleChoiceGroups = document.querySelectorAll('.button-answer:not([data-style-id])');
        const activeGroups = new Set();

        multipleChoiceGroups.forEach(button => {
            if (button.classList.contains('active')) {
                const groupName = button.getAttribute('name');
                activeGroups.add(groupName);
            }
        });

        filledInputs += activeGroups.size;


        return filledInputs;
    }

    const counterTotalInputs = () => {
        let totalInputs = 0;

        for (let i = 3; i <= 10; i++) {
            const step = document.querySelector(`.quiz-step[data-step="${i}"]`)
            if (step) {
                const inputs = step.querySelectorAll('input[type="text"]');
                totalInputs += inputs.length;
            }
        }

        const multipleChoiceGroups = document.querySelectorAll('.button-answer:not([data-style-id])');
        const allGroups = new Set();

        multipleChoiceGroups.forEach(button => {
            const groupName = button.getAttribute('name');
            if (groupName) {
                allGroups.add(groupName);
            }
        });

        totalInputs += allGroups.size + 1;

        return totalInputs
    }

    const updatePagination = () => {
        currentCounterPagination.textContent = counterFilledInputs();
        totalCounterPagination.textContent = counterTotalInputs();
    }

    const updateNextButton = () => {
        if (currentStep === 1 || currentStep === 2) {
            nextBtn.innerHTML = 'Выбрать стиль<div class="round-arrow"><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.7964 0.930089L8.13802 4.27171C8.6245 4.75819 8.28002 5.59102 7.59155 5.59055L1.58413 5.59055C0.709121 5.59008 -0.000445208 6.29965 2.31702e-05 7.17466C0.00049159 8.04966 0.709589 8.75876 1.58413 8.75876L7.59108 8.75829C8.27956 8.75876 8.62403 9.59065 8.13755 10.0771L4.79593 13.4187C6.03322 14.656 8.03913 14.656 9.27689 13.4183L13.2817 9.4135C14.519 8.17621 14.5194 6.16982 13.2821 4.93253L9.27782 0.928213C8.04053 -0.309077 6.03415 -0.309545 4.7964 0.928214L4.7964 0.930089Z" fill="white"/></svg></div>';

            if (selectedStyle) {
                nextBtn.disabled = false;
            } else {
                nextBtn.disabled = true;
            }
        } else if (currentStep === 0 || currentStep === 11) {
            nextBtn.disabled = false;
        } else {
            nextBtn.innerHTML = 'Далее<div class="round-arrow"><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.7964 0.930089L8.13802 4.27171C8.6245 4.75819 8.28002 5.59102 7.59155 5.59055L1.58413 5.59055C0.709121 5.59008 -0.000445208 6.29965 2.31702e-05 7.17466C0.00049159 8.04966 0.709589 8.75876 1.58413 8.75876L7.59108 8.75829C8.27956 8.75876 8.62403 9.59065 8.13755 10.0771L4.79593 13.4187C6.03322 14.656 8.03913 14.656 9.27689 13.4183L13.2817 9.4135C14.519 8.17621 14.5194 6.16982 13.2821 4.93253L9.27782 0.928213C8.04053 -0.309077 6.03415 -0.309545 4.7964 0.928214L4.7964 0.930089Z" fill="white"/></svg></div>';

            const isValid = validateStep(currentStep);
            nextBtn.disabled = !isValid;
        }
    }

    // const styleExamplesCache = new Map();

    // const loadStyleExamples = async (styleId) => {
    //     if (styleExamplesCache.has(styleId)) {
    //         return styleExamplesCache.get(styleId);
    //     }

    //     try {
    //         const response = await fetch(`http://localhost:3001/styles/${styleId}`);
    //         const data = await response.json();
    //         const examples = data.images;
    //         styleExamplesCache.set(styleId, examples);
    //         return examples;
    //     } catch (error) {
    //         console.error('Ошибка загрузки примеров:', error);
    //         return [];
    //     }
    // };

    // const displayStyleExamples = (examples) => {
    //     examples.forEach((exampleUrl, index) => {
    //         const exampleElement = document.getElementById(`example-image-${index + 1}`);
    //         if (exampleElement) {
    //             exampleElement.innerHTML = `<img src="${exampleUrl}" alt="Пример стиля ${index + 1}" loading="lazy">`;
    //         }
    //     });
    // }

    const showStyleExamples = (styleId) => {
    document.querySelectorAll('.style-example').forEach(example => {
         example.style.display = 'none';
    });
    const styleExamples = document.querySelectorAll(`.style-example[data-style-id="${styleId}"]`);
    styleExamples.forEach(example => {
        example.style.display = 'block';
    });
}

    showStyleBtn.addEventListener('click', function() {
        if (selectedStyle) {
            selectedStyleName.textContent = selectedStyle.name;
            currentStep = 2;
            showStep(currentStep);
            // const examples = loadStyleExamples(selectedStyle.id);
            // displayStyleExamples(examples);
            showStyleExamples(selectedStyle.id)
        }
    });

    backToStyleBtn.addEventListener('click', function() {
        currentStep = 1;
        showStep(currentStep);
    });

    startBtn.addEventListener('click', () => {
        currentStep = 1;
        showStep(currentStep);
    });

    form.addEventListener('input', (e) => {
        if (e.target.tagName === 'INPUT') {
            const input = e.target;
            if (!input.value.trim()) {
                input.style.borderColor = '#ff4444';
            } else {
                input.style.borderColor = '#f6b715';
            }

            if (currentStep >= 3 && currentStep < 11) {
                updateNextButton();
            }
            updatePagination()
        }
    });

    nextBtn.addEventListener('click', () => {
        const formData = new FormData(form);
        const inputs = form.querySelectorAll('input');

        inputs.forEach(input => {
            if (input.value.trim()) {
                formData.append(input.name, input.value);
            }
        });

        collectMultipleChoiceData(formData);

        if (selectedStyle) {
            formData.append('selected_style', selectedStyle.value);
            formData.append('selected_style_id', selectedStyle.id);
            formData.append('selected_style_name', selectedStyle.name);
        }

        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        console.log('форма', data);

        if (currentStep === 1 || currentStep === 2) {
            currentStep = 3;
        } else if (currentStep === 10) {
            currentStep = 11;
        } else {
            currentStep++;
        }

        showStep(currentStep);
        updatePagination()
    });

    prevBtn.addEventListener('click', () => {


        if (currentStep > 1) {

            if (currentStep === 3) {
                currentStep = 1;
            } else {
                currentStep--;
            }
            showStep(currentStep);
            updatePagination();
        }
    });

    document.querySelectorAll('.quiz-step__choose_style .button-answer').forEach(button => {
        button.addEventListener('click', function() {
            const styleValue = this.value;
            const styleId = this.getAttribute('data-style-id');
            const styleName = this.textContent.trim();

            if (selectedStyle && selectedStyle.id === styleId) {
                this.classList.remove('active');
                selectedStyle = null;
                showStyleBtn.hidden = true;
            } else {
                document.querySelectorAll('.quiz-step__choose_style .button-answer').forEach(btn => {
                    btn.classList.remove('active');
                });

                this.classList.add('active');
                selectedStyle = {
                    value: styleValue,
                    id: styleId,
                    name: styleName
                };
                showStyleBtn.hidden = false;
            }

            updateNextButton();
            updatePagination();
        });
    });

    initializeMultipleChoiceButtons();
    showStep(currentStep);
    updatePagination()
});