import './style.css'
import {calculator_buttons} from './data/buttons.data'
import {BaseModelButtons} from './data/base.model'
import {POWER,FACTORIAL} from './data/buttons.data'
import {DATA_operation_formula,NUMBER_factorialnumgetter,MyCallback} from './main.model'

// ******************* GENERAL VAR ******************* //
// DOM
const input_element = document.querySelector('.input') as HTMLElement;
const output_operation_element = document.querySelector('.operation .value') as HTMLElement;
const output_result_element = document.querySelector('.result .value') as HTMLElement;

const OPERATORS = ["+", "-", "*", "/"];
let data: DATA_operation_formula = {
    operation : [],
    formula: [],
}
let ANS = 0

// RENDER
function createCalculatorbutton():boolean {
    const buttons_per_row = 8
    let added_buttons = 0
    calculator_buttons.forEach(button => {
        if (added_buttons % buttons_per_row == 0) {
            input_element.innerHTML += `<div class = "row"></div>`
        }
        const row = document.querySelector(".row:last-child") as HTMLElement;
        row.innerHTML += `<button id = ${button.name}>
        ${button.symbol}
        </button>`
        added_buttons++
    })
    return true;
}

createCalculatorbutton()

// RAD and DEG
let RADIAN = true
const rad_btn = document.getElementById('rad') as HTMLElement;
const deg_btn = document.getElementById('deg') as HTMLElement;

rad_btn.classList.add("active-angle")

function angleToggle() {
    rad_btn.classList.toggle("active-angle")
    deg_btn.classList.toggle("active-angle")
}

input_element.addEventListener('click', event => {
    const target_btn = event.target as HTMLElement;
    calculator_buttons.forEach(button => {
        if (button.name == target_btn.id) {
            calculator(button)
        }

    })

})

// MAIN FUNCTION
function calculator(button: BaseModelButtons) {
    if (button.type == 'operator') {
        data.operation.push(button.symbol)
        data.formula.push(button.formula)
    }

    else if (button.type == 'number') {
        data.operation.push(button.symbol)
        data.formula.push(button.formula)
    }

    else if (button.type == 'trigo_function') {

        data.operation.push(button.symbol + '(')
        data.formula.push(button.formula)
        console.log(data.operation)
    }

    else if (button.type == 'math_function') {

        let symbol, formula;

        if (button.name == 'factorial') {
            symbol = "!"
            formula = button.formula

            data.operation.push(symbol)
            data.formula.push(formula)
        } else if (button.name == 'power') {
            symbol = "^("
            formula = button.formula

            data.operation.push(symbol)
            data.formula.push(formula)
        } else if (button.name == 'square') {
            symbol = "^("
            formula = button.formula
            data.operation.push(symbol)
            data.formula.push(formula)
            data.operation.push("2)")
            data.formula.push("2)")

        } else if (button.name == 'ln') {
            symbol = "ln("
            formula = button.formula + "("

            data.operation.push(symbol)
            data.formula.push(formula)


        } else if (button.name == 'log') {

            symbol = 'log('
            formula = button.formula + "("

            data.operation.push(symbol)
            data.formula.push(formula)
        } else if (button.name == 'exp') {

            symbol = 'exp('
            formula = button.formula + "("

            data.operation.push(symbol)
            data.formula.push(formula)

        } else {
            symbol = button.symbol + "("
            formula = button.formula
            data.operation.push(symbol)
            data.formula.push(formula)

        }
    }

    else if (button.type == 'key') {
        if (button.name == 'clear') {
            data.operation = []
            data.formula = []
            updateOutputresult(0)

        } else if (button.name == 'delete') {
            data.operation.pop()
            data.formula.pop()
        } else if (button.name == 'rad') {
            RADIAN = true
            angleToggle()
        } else if (button.name == 'deg') {
            RADIAN = false
            angleToggle()
        }

    }

    else if (button.type == 'calculate') {

        let formula_str = data.formula.join('')

        let POWER_SEARCH_RESULT = search(data.formula, POWER)

        let FACTORIAL_SEARCH_RESULT = search(data.formula, FACTORIAL)

        const BASES = powerbasegetter(data.formula, POWER_SEARCH_RESULT)

        BASES.forEach(base => {
            let toreplace = base + POWER
            let replacement = "Math.pow(" + base + ",";

            formula_str = formula_str.replace(toreplace, replacement)
        })


        const NUMBERS = factorialnumgetter(data.formula, FACTORIAL_SEARCH_RESULT)

        NUMBERS.forEach(number => {
            formula_str = formula_str.replace(number.toReplace.toString(),number.replacement.toString())
        })


        let result

        try {
            result = eval(formula_str)

        } catch (error) {
            if (error instanceof SyntaxError) {
                result = "SyntaxError"
                updateOutputresult(result)
                return
            }
        }

        ANS = result
        data.operation = [result]
        data.formula = [result]

        updateOutputresult(result)
        return
    }

    updateOutputOperation(data.operation.join(''))

}

function factorialnumgetter(formula: DATA_operation_formula['formula'], FACTORIAL_SEARCH_RESULT:number[]):NUMBER_factorialnumgetter[] {

    // store all the numbers in this array
    let numbers:NUMBER_factorialnumgetter[] = []

    let factorial_sequence = 0

    FACTORIAL_SEARCH_RESULT.forEach(fact_index => {

        // store the current number in this array

        let number:Object[] = []

        let next_index = fact_index + 1;

        let next_input = formula[next_index]

        if (next_index === parseInt(FACTORIAL)) {
            factorial_sequence += 1
            return
        }

        let first_fact_index = fact_index - factorial_sequence

        let prev_idx = first_fact_index - 1

        let paren_count = 0

        while (prev_idx >= 0) {

            if (formula[prev_idx] == '(') {
                paren_count -= 1
            }
            if (formula[prev_idx] == ')') {
                paren_count += 1
            }

            let is_operator = false

            OPERATORS.forEach(OPERATOR => {
                if (formula[prev_idx] == OPERATOR) {
                    is_operator = true
                }
            })

            if (is_operator && paren_count == 0) {
                break;
            }

            number.unshift(formula[prev_idx])

            prev_idx--;


        }

        let number_str = number.join('')
        const factorial = "factorial(",
            close_paren = ')'
        let times = factorial_sequence + 1

        let toreplace = number_str + FACTORIAL.repeat(times)

        let replacement = factorial.repeat(times) + number_str + close_paren

        numbers.push({
            toReplace: toreplace,
            replacement: replacement,
        })

        factorial_sequence = 0
    })

    return numbers


}

// powerbase getter.this code is explained in the calculator.ipynb please check there!


function powerbasegetter(formula:DATA_operation_formula['formula'], POWER_SEARCH_RESULT:number[]):string[] {

    // here i will store all the bases !

    let powers_base:string[] = []

    POWER_SEARCH_RESULT.forEach(power_index => {
        let base = []

        let paren_count = 0

        let prev_idx = power_index - 1

        while (prev_idx >= 0) {

            if (formula[prev_idx] == '(') {
                paren_count -= 1
            }
            if (formula[prev_idx] == ')') {
                paren_count += 1
            }

            let is_operator = false

            OPERATORS.forEach(OPERATOR => {
                if (formula[prev_idx] == OPERATOR) {
                    is_operator = true
                }
            })

            let is_power = formula[prev_idx] == POWER

            if ((is_operator && paren_count == 0) || is_power) {
                break;
            }
            base.unshift(formula[prev_idx])
            prev_idx--;
        }
        powers_base.push(base.join(''))
    })

    return powers_base
}

// SEARCH FUNCTION

function search(array:DATA_operation_formula['formula'], keyword: string):number[] {
    let search_res:number[] = []

    array.forEach((element, index) => {
        if (element == keyword) {
            search_res.push(index)
        }
    })

    return search_res

}

function updateOutputOperation(operation:string) {
    output_operation_element.innerHTML = operation
}

function updateOutputresult(result:string | number) {
    output_result_element.innerHTML = result.toString();
}

function trigo(callback:MyCallback, angle:number) {
    if (!RADIAN) {
        angle = angle * Math.PI / 180
    }
    return callback(angle)
}

function inv_trigo(callback:MyCallback, value:number) {
    let angle = callback(value) as number;
    if (!RADIAN) {
        angle = angle * 180 / Math.PI
    }

    return angle

}

function factorial(number:number) {
    if (number % 1 != 0) {
        return gamma(number + 1)
    }
    if (number == 0 || number == 1) {
        return 1
    }

    let result = 1

    for (let i = 1; i <= number; i++) {
        result *= i
    }
    if (result == Infinity) {
        return Infinity
    }

    return result
}

// GAMMA FUNCTINON
function gamma(n:number) {
    var g = 7, 
        p = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
    if (n < 0.5) {
        return Math.PI / Math.sin(n * Math.PI) / gamma(1 - n);
    } else {
        n--;
        var x = p[0];
        for (var i = 1; i < g + 2; i++) {
            x += p[i] / (n + i);
        }
        var t = n + g + 0.5;
        return Math.sqrt(2 * Math.PI) * Math.pow(t, (n + 0.5)) * Math.exp(-t) * x;
    }
}