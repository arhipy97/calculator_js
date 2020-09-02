const WRAPPER = createElem('div', 'wrapper');
const CALCULATOR = createElem('div', 'calculator');
const SCREEN = createElem('output', 'calculator_screen');
const symbolRows = {
    firstRow: ['AC', '*'],
    secondRow: ['7', '8', '9', '/'],
    thirdRow: ['4', '5', '6', '+'],
    fourthRow: ['1', '2', '3', '-'],
    fifthRow: ['0', '.', '='],
};
const ACTION_LOG = [];
let firstNumber;
let action;
let result;
let secondNumber;

function renderCalculator() {
    document.body.prepend(WRAPPER);
    WRAPPER.prepend(CALCULATOR);
    CALCULATOR.prepend(SCREEN);
    renderButtons();
    setActionOnBtn();
}

function createElem(tag, ...className) {
    const ELEM = document.createElement(tag);
    ELEM.classList.add(...className);
    return ELEM;
}

function renderButtons() {
    let counter = 1;
    for (let row in symbolRows) {
        const ROW = createElem('div', 'calculator__row', `row${counter}`);
        CALCULATOR.append(ROW);
        symbolRows[row].forEach((symbol) => {
            const BUTTON = createElem('div', 'calculator__btn');
            BUTTON.setAttribute('val', `${symbol}`);
            BUTTON.innerHTML = symbol;
            ROW.append(BUTTON);
        });
        counter++;
    }
}

function setActionOnBtn() {
    document.querySelectorAll('.calculator__btn').forEach(function (button) {
        button.addEventListener('click', onButtonClick);
    });
}

function checkValueNumber(value) {
    return Number(value) >= 0 && SCREEN.innerHTML.length < 9;
}

function checkValuePoint(value) {
    return (
        value === '.' &&
        SCREEN.innerHTML.indexOf('.') === -1 &&
        SCREEN.innerHTML.length > 0 &&
        SCREEN.innerHTML.length < 8
    );
}

function isValueNumberHandler(value) {
    SCREEN.innerHTML += value;
    if (SCREEN.innerHTML.indexOf('00') === 0) {
        SCREEN.innerHTML = '0';
    }
}

function isValueACHandler() {
    SCREEN.innerHTML = '';
}

function isValuePointHandler(value) {
    SCREEN.innerHTML += value;
}

function pushToActionLog(expression) {
    ACTION_LOG.push(expression);
}

function cutResultValueLengthToNineSymbols(resul) {
    const POINT_POSITION = resul.toString().indexOf('.');
    if (POINT_POSITION > -1 && POINT_POSITION < 8) {
        return parseFloat(resul.toFixed(8 - POINT_POSITION));
    } else if (resul.toString().length > 9) {
        return 'Err:length';
    }
    return parseFloat(resul);
}

function isValueEquallyHandler() {
    secondNumber = +SCREEN.innerHTML;
    result = defineResultValue(action, firstNumber, secondNumber);
    pushToActionLog(`${firstNumber} ${action} ${secondNumber} = ${result}`);
    SCREEN.innerHTML = result;
}

function defaultHandler(value) {
    firstNumber = +SCREEN.innerHTML;
    action = value;
    SCREEN.innerHTML = '';
}

function defineResultValue(action, firstNumber, secondNumber) {
    let result;
    switch (action) {
        case '+':
            result = firstNumber + secondNumber;
            break;
        case '-':
            result = firstNumber - secondNumber;
            break;
        case '/':
            result = firstNumber / secondNumber;
            break;
        case '*':
            result = firstNumber * secondNumber;
            break;
        default:
            break;
    }
    return cutResultValueLengthToNineSymbols(result);
}

function onButtonClick(event) {
    const VALUE = event.target.getAttribute('val');
    if (checkValueNumber(VALUE)) {
        isValueNumberHandler(VALUE);
    } else if (VALUE === 'AC') {
        isValueACHandler();
    } else if (checkValuePoint(VALUE)) {
        isValuePointHandler(VALUE);
    } else if (VALUE === '=') {
        isValueEquallyHandler();
    } else {
        defaultHandler(VALUE);
    }
}

renderCalculator();
