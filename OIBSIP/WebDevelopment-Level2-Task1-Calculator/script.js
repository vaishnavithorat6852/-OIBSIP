const historyDisplay = document.getElementById('history-display');
const mainDisplay = document.getElementById('main-display');
const buttons = document.querySelectorAll('.btn');

let currentValue = '0';
let previousValue = null;
let currentOperator = null;
let shouldResetDisplay = false;

const operatorSymbols = {
    '+': '+',
    '-': '−',
    '*': '×',
    '/': '÷'
};

function formatResult(value) {
    if (value === 'Error') return 'Error';
    const num = parseFloat(value);
    if (isNaN(num)) return 'Error';
    return parseFloat(num.toPrecision(12)).toString();
}

function calculate(prev, curr, op) {
    const a = parseFloat(prev);
    const b = parseFloat(curr);
    if (isNaN(a) || isNaN(b)) return 'Error';
    switch (op) {
        case '+': return (a + b).toString();
        case '-': return (a - b).toString();
        case '*': return (a * b).toString();
        case '/': return b === 0 ? 'Error' : (a / b).toString();
        default: return curr;
    }
}

function updateDisplay() {
    mainDisplay.textContent = currentValue;
}

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const number = button.dataset.number;
        const operator = button.dataset.operator;
        const action = button.dataset.action;
        
        if (currentValue === 'Error' && action !== 'clear' && !number) {
            return;
        }
        
        if (number !== undefined) {
            if (currentValue === '0' || shouldResetDisplay) {
                currentValue = number === '.' ? '0.' : number;
                shouldResetDisplay = false;
            } else {
                if (number === '.' && currentValue.includes('.')) return;
                currentValue += number;
            }
            updateDisplay();
        }
        
        if (operator !== undefined) {
            if (currentOperator && !shouldResetDisplay) {
                const result = calculate(previousValue, currentValue, currentOperator);
                if (result === 'Error') {
                    currentValue = 'Error';
                    previousValue = null;
                    currentOperator = null;
                    historyDisplay.textContent = '';
                } else {
                    currentValue = formatResult(result);
                    previousValue = currentValue;
                    historyDisplay.textContent = `${previousValue} ${operatorSymbols[operator]}`;
                }
            } else {
                previousValue = currentValue;
                historyDisplay.textContent = `${previousValue} ${operatorSymbols[operator]}`;
            }
            currentOperator = operator;
            shouldResetDisplay = true;
            updateDisplay();
        }
        
        if (action !== undefined) {
            if (action === 'clear') {
                currentValue = '0';
                previousValue = null;
                currentOperator = null;
                shouldResetDisplay = false;
                historyDisplay.textContent = '';
                updateDisplay();
            } else if (action === 'delete') {
                if (shouldResetDisplay) return;
                if (currentValue.length > 1) {
                    currentValue = currentValue.slice(0, -1);
                } else {
                    currentValue = '0';
                }
                updateDisplay();
            } else if (action === 'equals') {
                if (!currentOperator || shouldResetDisplay) return;
                const result = calculate(previousValue, currentValue, currentOperator);
                if (result === 'Error') {
                    currentValue = 'Error';
                    previousValue = null;
                    currentOperator = null;
                    historyDisplay.textContent = '';
                } else {
                    const formatted = formatResult(result);
                    historyDisplay.textContent = `${previousValue} ${operatorSymbols[currentOperator]} ${currentValue} =`;
                    currentValue = formatted;
                    previousValue = null;
                    currentOperator = null;
                }
                shouldResetDisplay = true;
                updateDisplay();
            }
        }
    });
});

window.addEventListener('keydown', (e) => {
    let btn = null;
    if (e.key >= '0' && e.key <= '9') {
        btn = document.querySelector(`button[data-number="${e.key}"]`);
    } else if (e.key === '.') {
        btn = document.querySelector('button[data-number="."]');
    } else if (e.key === '+') {
        btn = document.querySelector('button[data-operator="+"]');
    } else if (e.key === '-') {
        btn = document.querySelector('button[data-operator="-"]');
    } else if (e.key === '*' || e.key === 'x' || e.key === 'X') {
        btn = document.querySelector('button[data-operator="*"]');
    } else if (e.key === '/') {
        e.preventDefault();
        btn = document.querySelector('button[data-operator="/"]');
    } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        btn = document.querySelector('button[data-action="equals"]');
    } else if (e.key === 'Backspace') {
        btn = document.querySelector('button[data-action="delete"]');
    } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        btn = document.querySelector('button[data-action="clear"]');
    }
    
    if (btn) {
        btn.classList.add('keyboard-active');
        btn.click();
        setTimeout(() => btn.classList.remove('keyboard-active'), 100);
    }
});
