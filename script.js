import { monthSlider, isDownMonth, monthStartX, monthScrollLeft, monthButtons, monthSelectedButton } from './month_horizontal_slider.js';
import { slider, isDown, startX, scrollLeft, yearButtons, selectedButton } from './year_horizontal_slider.js';
const APILINK = 'https://splithings.onrender.com/api/v1/split/';

let user = 'user1';

const user1Card = document.querySelector('.js-user1-card');
const user2Card = document.querySelector('.js-user2-card');

returnExpenses(APILINK);

const monthSelect = document.getElementById('dueDateMonth');
const yearSelect = document.getElementById('dueDateYear');

let selectedYear = new Date().getFullYear();
let selectedMonth = new Date().getMonth() + 1;

const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

monthSelect.value = months[selectedMonth - 1];
yearSelect.value = selectedYear.toString();

function returnExpenses() {
    fetch(APILINK).then(res => res.json())
    .then(data => {
        data = data.filter(expense => expense.dueDateYear == selectedYear);
        if (selectedMonth != 0) {
            data = data.filter(expense => expense.dueDateMonth == months[selectedMonth - 1]);
        }

        data.sort((a, b) => a.dueDateYear - b.dueDateYear || a.dueDateMonth - b.dueDateMonth);
        let totalUser1 = 0;
        let totalUser2 = 0;
        let currentMonthUser1 = null;
        let currentMonthUser2 = null;
        data.forEach(expense => {
            let categorySymbols = {
                "Mercearia": "shopping_basket",
                "Casa": "home",
                "Viagem": "explore",
                "Restaurantes": "local_pizza",
                "Bilhetes": "confirmation_number",
                "Outros": "mode_fan"
            };
            let categorySymbol = categorySymbols[expense.category];

            if (selectedMonth == 0) {
                if (expense.user === 'user1' && currentMonthUser1 !== expense.dueDateMonth) {
                    currentMonthUser1 = expense.dueDateMonth;
                    const monthSeparator = document.createElement('div');
                    monthSeparator.classList.add('month-separator');
                    monthSeparator.innerHTML = `<p>${currentMonthUser1}</p>`;
                    user1Card.appendChild(monthSeparator);
                } else if (expense.user === 'user2' && currentMonthUser2 !== expense.dueDateMonth) {
                    currentMonthUser2 = expense.dueDateMonth;
                    const monthSeparator = document.createElement('div');
                    monthSeparator.classList.add('month-separator');
                    monthSeparator.innerHTML = `<p>${currentMonthUser2}</p>`;
                    user2Card.appendChild(monthSeparator);
                }
            }

            const div_card = document.createElement('div');
            div_card.classList.add('expense-card');
            div_card.innerHTML =`
                <div class="expenses_by_name_card">
                    <div class="expense_data" id="${expense._id}">
                        <div class="expense_data_part_1" onclick="editExpense('${expense._id}', '${expense.user}', '${expense.expense}', '${expense.cashValue}', '${expense.category}', '${expense.dueDateMonth}', '${expense.dueDateYear}')">
                            <i class="material-symbols-outlined icon" style="font-size: 1vw;">${categorySymbol}</i>
                            <p class="expense_name">${expense.expense.toLowerCase()}</p>
                        </div>
                        <div class="expense_data_part_2">
                            <p class="cash_value">${expense.cashValue.replace('.', ',')}€</p>
                            <button onclick="deleteExpense('${expense._id}')" style="padding: 0px">
                                <i class="material-symbols-outlined" style="font-size: 1.2vw;">delete</i>
                            </button>
                        </div>
                    </div>
                </div>
            `
            if (expense.user === 'user1') {
                totalUser1 += parseFloat(expense.cashValue);
                user1Card.appendChild(div_card);
            } else if (expense.user === 'user2') {
                totalUser2 += parseFloat(expense.cashValue);
                user2Card.appendChild(div_card);
            }
        });
        let monthGoal = 200;
        let totalBothUsers = totalUser1 + totalUser2;
        let percentageBarValue = (totalBothUsers * 100) / monthGoal;
        let mensalGoalText = document.querySelector('.js-mensal-goal-text');
        let percentageText = document.querySelector('.js-percentage-bar-value');
        let percentageBarGraphic = document.querySelector('.percentage_bar');

        let splitValue = (totalUser1 - totalUser2) / 2;

        if (splitValue < 0) {
            splitValue = splitValue * (-1);
        }

        let splitValueEuros = Math.floor(splitValue);

        document.querySelector('.js_total_user1').textContent = totalUser1.toFixed(2).replace('.', ',') + '€';
        document.querySelector('.js_total_user2').textContent = totalUser2.toFixed(2).replace('.', ',') + '€';
        document.querySelector('.js-total-both-users').textContent = totalBothUsers.toFixed(0) + '€';
        document.querySelector('.js-user_debt_euros').textContent = '€' +splitValueEuros;

        let splitValueCents = (splitValue * 100) - (splitValueEuros * 100);
        if (splitValueCents > 0 && splitValueCents < 10 ) {
            document.querySelector('.js-user_debt_cents').textContent = ',' + (splitValueCents * 10).toFixed(0);
        } else if (splitValueCents == 0) {
            document.querySelector('.js-user_debt_cents').textContent = ',00';
        } else {
            document.querySelector('.js-user_debt_cents').textContent = ',' + splitValueCents.toFixed(0);
        }

        percentageText.textContent = percentageBarValue.toFixed(0) + '%';

        if (percentageBarValue > 100) {
            percentageBarGraphic.style.width = '100%';
        } else {
            percentageBarGraphic.style.width = percentageBarValue.toFixed(0) + '%';
        }

        if (percentageBarValue > 16 && percentageBarValue <= 47 ) {
            mensalGoalText.style.position = 'absolute';
            mensalGoalText.style.left = '16.2vw';
            mensalGoalText.style.color = '#2A4E56';
            percentageBarGraphic.style.flexDirection = 'row-reverse';
            percentageText.style.color = '';
            percentageText.style.position = '';
            percentageText.style.left = '';
        } else if (percentageBarValue <= 16) {
            mensalGoalText.style.position = 'absolute';
            mensalGoalText.style.left = '16.2vw';
            mensalGoalText.style.color = '#2A4E56';
            percentageBarGraphic.style.flexDirection = 'row';
            percentageText.style.color = '#2A4E56';
            percentageText.style.position = 'relative';
            percentageText.style.left = '85%';
        } else {
            mensalGoalText.style.position = '';
            mensalGoalText.style.left = '';
            mensalGoalText.style.color = '';
            percentageBarGraphic.style.flexDirection = '';
            percentageText.style.color = '';
            percentageText.style.position = '';
            percentageText.style.left = '';
        }     
    });
}

yearButtons.forEach(button => {
    button.addEventListener('click', () => {
        selectedYear = button.getAttribute('data-year');
        document.querySelectorAll('.expense-card, .month-separator').forEach(element => {
        element.remove();
        });
        returnExpenses();
    });
});

monthButtons.forEach(button => {
    button.addEventListener('click', () => {
      selectedMonth = button.getAttribute('data-month');
      document.querySelectorAll('.expense-card, .month-separator').forEach(element => {
        element.remove();
      });
      returnExpenses();
    });
});

function editExpense(id, editedUser, expense, cashValue, category, dueDateMonth, dueDateYear) {
    const element = document.getElementById(id);
    const userInputId = "editedUser" + id;
    const expenseInputId = "review" + id;
    const cashValueInputId = "cashValue" + id;
    const categoryInputId = "category" + id;
    const dueDateMonthInputId = "dueDateMonth" + id;
    const dueDateYearInputId = "dueDateYear" + id;

    let categorySymbols = {
        "Mercearia": "shopping_basket",
        "Casa": "home",
        "Viagem": "explore",
        "Restaurantes": "local_pizza",
        "Bilhetes": "confirmation_number",
        "Outros": "mode_fan"
    };

    let categorySymbol = categorySymbols[category];

    element.innerHTML = `
        <div class="expense_data_edit">
            <div class="expense_data_editable">
                <div class="expense_data_edit_part_1">
                    <p>
                        <button id="${categoryInputId}" value="${category}" onclick="changeCategory('${categoryInputId}')">
                            <i class="material-symbols-outlined icon" style="font-size: 1vw;">${categorySymbol}</i>
                        </button>
                    </p>
                    <p>
                        <input type="text" class="expense_name_input_edit" id="${expenseInputId}" value="${expense.toLowerCase()}">
                    </p>
                </div>
                <div class="expense_data_edit_part_2">
                    <p>
                        <input type="text" class="cash_value_input_edit" id="${cashValueInputId}" value="${cashValue.replace('.', ',')}€">
                    </p>
                    <button onclick="saveExpense('${userInputId}', '${expenseInputId}', '${cashValueInputId}', '${categoryInputId}', '${dueDateMonthInputId}', '${dueDateYearInputId}', '${id}',)" style="padding: 0px">
                        <i class="material-symbols-outlined" style="font-size: 1.2vw;">done</i>
                    </button>
                </div>
            </div>
            <div style="display: none">        
                <p>
                    <form id="form">
                        <input type="radio" id="${userInputId}" name="nome" value="user1" ${editedUser === 'user1' ? 'checked' : ''} disabled>
                        <label for="sandro">Sandro</label><br>
                        <input type="radio" id="${userInputId}" name="nome" value="user2" ${editedUser === 'user2' ? 'checked' : ''} disabled>
                        <label for="tania">Tânia</label><br>
                    </form>
                </p>    
                <p>
                    <input type="text" id="${dueDateMonthInputId}" value="${dueDateMonth}" disabled>
                    <input type="text" id="${dueDateYearInputId}" value="${dueDateYear}" disabled>
                </p>
            </div>
        </div>    
    `;

    const form = document.getElementById('form');
    form.onchange = function() {
        editedUser = document.querySelector('input[name="nome"]:checked').value;
    };
}

function changeCategory(categoryInputId) {
    let button = document.getElementById(categoryInputId);
    let currentCategory = button.value;
    let categories = ["Mercearia", "Casa", "Viagem", "Restaurantes", "Bilhetes", "Outros"];
    let index = categories.indexOf(currentCategory);

    if (index === -1) {
        button.value = categories[0];
    } else {
        button.value = categories[(index + 1) % categories.length];
    }

    let categorySymbols = {
        "Mercearia": "shopping_basket",
        "Casa": "home",
        "Viagem": "explore",
        "Restaurantes": "local_pizza",
        "Bilhetes": "confirmation_number",
        "Outros": "mode_fan"
    };
    let icon = button.querySelector('.material-symbols-outlined');
    icon.textContent = categorySymbols[button.value];
}



function saveExpense(userInputId, expenseInputId, cashValueInputId, categoryInputId, dueDateMonthInputId, dueDateYearInputId, id="") {
    const expense = document.getElementById(expenseInputId).value;
    const cashValue = document.getElementById(cashValueInputId).value;
    const category = document.getElementById(categoryInputId).value;
    const dueDateMonth = document.getElementById(dueDateMonthInputId).value;
    const dueDateYear = document.getElementById(dueDateYearInputId).value;
    let editedUserElement = document.querySelector(`input[id="${userInputId}"]:checked`);
    let editedUser = editedUserElement ? editedUserElement.value : '';
    let user = document.querySelector('input[name="nome"]:checked').value;

    form.onchange = function() {
        user = document.querySelector('input[name="nome"]:checked').value;
    };

    if (id) {
        fetch(APILINK + id, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"user": editedUser, "expense": expense, "cashValue": cashValue, "category": category, "dueDateMonth": dueDateMonth, "dueDateYear": dueDateYear})
        }).then(res => res.json())
            .then(res => {
                console.log(res)
                location.reload();
            });
    } else {
        fetch(APILINK + "new", {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"user": user, "expense": expense, "cashValue": cashValue, "category": category, "dueDateMonth": dueDateMonth, "dueDateYear": dueDateYear})
        }).then(res => res.json())
            .then(res => {
                console.log(res)
                location.reload();
            });
    }
}

function deleteExpense(id) {
    console.log('Deleting expense with ID:', id);
    fetch(APILINK + id, {
        method: 'DELETE'
    }).then(res => res.json())
        .then(res => {
            location.reload();
        });
}

window.saveExpense = saveExpense;
window.editExpense = editExpense;
window.deleteExpense = deleteExpense;
window.changeCategory = changeCategory;