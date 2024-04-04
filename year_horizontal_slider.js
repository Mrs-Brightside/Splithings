export const slider = document.querySelector('.js_choose_expense_year');
export let isDown = false;
export let startX;
export let scrollLeft;

export const yearButtons = document.querySelectorAll('.year');
export let selectedButton = null;


slider.addEventListener('mousedown', (e) => {
    isDown = true;
    slider.classList.add('active');
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
});
slider.addEventListener('mouseleave', () => {
    isDown = false;
    slider.classList.remove('active');
});
slider.addEventListener('mouseup', () => {
    isDown = false;
    slider.classList.remove('active');
});
slider.addEventListener('mousemove', (e) => {
    if(!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2;
    slider.scrollLeft =  scrollLeft - walk;
});

yearButtons.forEach(button => {
    button.addEventListener('click', () => {
        slider.scrollLeft = button.offsetLeft;
        if (selectedButton) {
            selectedButton.classList.remove('selected');
            selectedButton.style.opacity = '0.3';
        }
        button.classList.add('selected');
        button.style.opacity = '1';
        selectedButton = button;
    });
});

slider.addEventListener('scroll', () => {
    yearButtons.forEach((button, index) => {
        const buttonPosition = button.offsetLeft - slider.scrollLeft;
        if (buttonPosition <= 5 && button !== selectedButton) {
            if (selectedButton) {
                selectedButton.classList.remove('selected');
                selectedButton.style.opacity = '0.3';
            }
            button.classList.add('selected');
            button.style.opacity = '1';
            selectedButton = button;
            let selectedIndex = Array.from(yearButtons).indexOf(selectedButton);
            if (selectedIndex !== null) {
                if (yearButtons[selectedIndex + 1]) {
                    yearButtons[selectedIndex + 1].style.opacity = '0.4';
                }
                if (yearButtons[selectedIndex + 2]) {
                    yearButtons[selectedIndex + 2].style.opacity = '0.2';
                }
                for (let i = selectedIndex + 3; i < yearButtons.length; i++) {
                    if (yearButtons[i]) {
                        yearButtons[i].style.opacity = '0';
                    }
                }
            }
        }
    });
});

let anoAtual = new Date().getFullYear();
let botaoAnoAtual = document.querySelector(`.year[data-year="${anoAtual}"]`);

if (botaoAnoAtual) {
    slider.scrollLeft = botaoAnoAtual.offsetLeft;
    botaoAnoAtual.classList.add('selected');
    botaoAnoAtual.style.color = '#2A4E56';
}

window.addEventListener('load', () => {
    let selectedButton = document.querySelector(`.year[data-year="${anoAtual}"]`);
    let selectedIndex = Array.from(yearButtons).indexOf(selectedButton);
    if (selectedButton) {
        selectedButton.style.opacity = '1';
    }

    yearButtons.forEach((button, index) => {
        if (selectedButton !== null) {
            if (yearButtons[selectedIndex + 1]) {
                yearButtons[selectedIndex + 1].style.opacity = '0.4';
            }
            if (yearButtons[selectedIndex + 2]) {
                yearButtons[selectedIndex + 2].style.opacity = '0.2';
            }
            for (let i = selectedIndex + 3; i < yearButtons.length; i++) {
                if (yearButtons[i]) {
                    yearButtons[i].style.opacity = '0';
                }
            }
        }
    });
});
