import React, { useState, useEffect } from 'react';

import { numbers, operators } from './utils';
import './App.css';


function App() {

  const [ displayFormula, setDisplayFormula ] = useState("0");
  const [ resultFormula, setResultFormula ] = useState("");
  const [ inputValue, setInputValue ] = useState("0");
  const [ calValue, setCalValue ] = useState(0);
  const [ isResult, setIsResult ] = useState(false);
  // const [ isNextValue, setIsNextValue ] = useState(false);

  // useEffect(() => {
  //   console.log(displayFormula);
  // });

  // useEffect: document.addEventListener("keydown", ..);

  // regular expressions methods accept strings as parameters.

  // quantifier: 
  // x* : matches the preceeding item x 0 or more times. [matches \d 0 or more times]
  // x?: matches the preceeding item 0 or 1 times. [matches \d* 0 or 1 time]
  // x*?: stop finding as long as it finds a match. [stop searching as long as it finds a number in \d]
  // (x): capturing group: matches x and remembers the match. [matches 0 or multtiple 0s]
  // $: the end of input
  // ^: the start of input

  const endWithZeroAfterDecimal = /\.\d*?(0*)$/;
  const beginWithNegativeSign = /^-?\d*\.?/;
  const formulaHasOperator = /\d*([\*\/\+\-\=])\d*/;

  // perform operations
  const handleCalculation = (event, oper) => {
    event.preventDefault();
    const match = resultFormula.match(formulaHasOperator);
    const nextValue = parseFloat(inputValue);
    console.log(match);
    let newCalValue = parseFloat(calValue);
    if (match) {
      switch (match[1]) {
        case "+":
          newCalValue += nextValue;
          break;
        case "-":
          newCalValue -= nextValue;
          break;
        case "*":
          newCalValue *= nextValue;
          break;
        case "/":
          newCalValue /= nextValue;
          break;
        default:
          return newCalValue;
      }

      // get a result
      if (oper === "=") {
        setIsResult(true);
        handleFormula(`=${newCalValue}`);
        handleResultFormula(`=${newCalValue}`);
      } else {
        handleFormula(oper);
        handleResultFormula(newCalValue, oper, true);
      }
      setCalValue(newCalValue);
    } else {
      newCalValue = inputValue;
      setCalValue(newCalValue);
      handleFormula(oper);
      handleResultFormula(oper);
    }
    handleClearInput();
  }

  // update the input value
  const handleInput = (event, number) => {
    event.preventDefault();
    let newInputValue = inputValue;
    if (newInputValue === "0") {
      newInputValue = number;
    } else {
      newInputValue += number;
    }
    handleFormula(newInputValue);
    setInputValue(newInputValue);
    handleResultFormula(newInputValue);
  }

  // update formula with the new added numbers or operators
  const handleFormula = (numOrOper) => {
    let newFormula = displayFormula;
    if (newFormula === "0") {
      newFormula = numOrOper;
    } else if (numOrOper.startsWith("=")) {
      newFormula += numOrOper;
    } else {
      newFormula = newFormula + numOrOper.slice(-1);
    }
    setDisplayFormula(newFormula);
  }

  const handleResultFormula = (numOrOper, oper = null, isCalValue = false) => {
    let newResultFormula = resultFormula;
    if (isCalValue) {
      newResultFormula = numOrOper + oper;
    } else if (numOrOper.startsWith("=")) {
      newResultFormula += numOrOper;
    } else {
      newResultFormula += numOrOper.slice(-1);
    }
    console.log(newResultFormula);
    setResultFormula(newResultFormula);
  }

  const handleClearInput = () => {
    setInputValue("0");
  } 

  const handleClear = (event) => {
    event.preventDefault();
    setDisplayFormula("0");
    setResultFormula("");
    setInputValue("0");
    setCalValue(0);
    setIsResult(false);
  } 

  return (
    <div className="App">
      <div id="display">
        { isResult ? calValue: inputValue}
      </div>
      <div id="formula">
        {displayFormula}
      </div>
      <div>
        <button 
          id="equals" 
          onClick = {(event) => handleCalculation(event, "=")}
        > 
          =
        </button>
      </div>
      <div className="numButtons"> 
        { numbers.map( num => 
          <button 
            id={num.button}
            onClick = {(event) => handleInput(event, num.number)}
          > 
            {num.number} 
          </button>)}
      </div>
      <div className="operButtons">
        { operators.map( oper => 
          <button 
            id={oper.id}
            onClick={(event) => handleCalculation(event, oper.operation)}
          >
            {oper.operation}
          </button>)
        }
      </div>
      <div>
        <button id="decimal">.</button>
      </div>
      <div>
        <button id="clear" onClick={handleClear}>C</button>
      </div>
    </div>
  );
}

export default App;
