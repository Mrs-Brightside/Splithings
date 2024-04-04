export const monthSlider = document.querySelector('.js_choose_expense_month');
export let isDownMonth = false;
export let monthStartX;
export let monthScrollLeft;

export const monthButtons = document.querySelectorAll('.month');
export let monthSelectedButton = null;

monthSlider.addEventListener('mousedown', (e) => {
  isDownMonth = true;
  monthSlider.classList.add('active');
  monthStartX = e.pageX - monthSlider.offsetLeft;
  monthScrollLeft = monthSlider.scrollLeft;
});

monthSlider.addEventListener('mouseleave', () => {
  isDownMonth = false;
  monthSlider.classList.remove('active');
});

monthSlider.addEventListener('mouseup', () => {
  isDownMonth = false;
  monthSlider.classList.remove('active');
});

monthSlider.addEventListener('mousemove', (e) => {
  if(!isDownMonth) return;
  e.preventDefault();
  const x = e.pageX - monthSlider.offsetLeft;
  const walk = (x - monthStartX) * 2;
  monthSlider.scrollLeft = monthScrollLeft - walk;
});

monthButtons.forEach(button => {
  button.addEventListener('click', () => {
    monthSlider.scrollLeft = button.offsetLeft;
    if (monthSelectedButton) {
      monthSelectedButton.classList.remove('selected');
      monthSelectedButton.style.opacity = '0.3';
    }
    button.classList.add('selected');
    button.style.opacity = '1';
    monthSelectedButton = button;
  });
});

monthSlider.addEventListener('scroll', () => {
  monthButtons.forEach((button, index) => {
    const buttonPosition = button.offsetLeft - monthSlider.scrollLeft;
    if (buttonPosition <= 5 && button !== monthSelectedButton) {
      if (monthSelectedButton) {
        monthSelectedButton.classList.remove('selected');
        monthSelectedButton.style.opacity = '0.3';
      }
      button.classList.add('selected');
      button.style.opacity = '1';
      monthSelectedButton = button;
      let selectedIndex = Array.from(monthButtons).indexOf(monthSelectedButton);
      if (selectedIndex !== null) {
        if (monthButtons[selectedIndex + 1]) {
          monthButtons[selectedIndex + 1].style.opacity = '0.4';
        }
        if (monthButtons[selectedIndex + 2]) {
          monthButtons[selectedIndex + 2].style.opacity = '0.2';
        }
        for (let i = selectedIndex + 3; i < monthButtons.length; i++) {
          if (monthButtons[i]) {
            monthButtons[i].style.opacity = '0';
          }
        }
      }
    }
  });
});

let mesAtual = new Date().getMonth() + 1;
let botaoMesAtual = document.querySelector(`.month[data-month="${mesAtual}"]`);

if (botaoMesAtual) {
  monthSlider.scrollLeft = botaoMesAtual.offsetLeft;
  botaoMesAtual.classList.add('selected');
  botaoMesAtual.style.color = '#2A4E56';
}

window.addEventListener('load', () => {
  let monthSelectedButton = document.querySelector(`.month[data-month="${mesAtual}"]`);
  let selectedIndex = Array.from(monthButtons).indexOf(monthSelectedButton);
  if (monthSelectedButton) {
    monthSelectedButton.style.opacity = '1';
  }

  monthButtons.forEach((button, index) => {
    if (monthSelectedButton !== null) {
      if (monthButtons[selectedIndex + 1]) {
        monthButtons[selectedIndex + 1].style.opacity = '0.4';
      }
      if (monthButtons[selectedIndex + 2]) {
        monthButtons[selectedIndex + 2].style.opacity = '0.2';
      }
      for (let i = selectedIndex + 3; i < monthButtons.length; i++) {
        if (monthButtons[i]) {
          monthButtons[i].style.opacity = '0';
        }
      }
    }
  });
});
