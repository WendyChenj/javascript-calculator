import React, { useState } from 'react';

import { numbers, operators } from './utils';
import './App.css';


function App() {

  const [ displayFormula, setDisplayFormula ] = useState("0");
  const [ resultFormula, setResultFormula ] = useState("");
  const [ inputValue, setInputValue ] = useState("0");
  const [ calValue, setCalValue ] = useState(0);
  const [ isResult, setIsResult ] = useState(false);

  // regular expressions methods accept strings as parameters.

  // quantifier: 
  // x* : matches the preceeding item x 0 or more times. [matches \d 0 or more times]
  // x?: matches the preceeding item 0 or 1 times. [matches \d* 0 or 1 time]
  // x*?: stop finding as long as it finds a match. [stop searching as long as it finds a number in \d]
  // (x): capturing group: matches x and remembers the match. [matches 0 or multtiple 0s]
  // $: the end of input
  // ^: the start of input

  const beginWithNegativeSign = /^-\d*\.?/;
  const formulaHasOperator = /\d+([\*\/\+\-\=])\d*/;
  const formulaEndWithOperator = /[\*\/\+\-]$/;

  // perform operations
  const handleCalculation = (event, oper) => {
    event.preventDefault();
    handleClearInput();
    const nextValue = parseFloat(inputValue);
    let newCalValue = parseFloat(calValue);
    let match = "";

    // if before the operator, there is a operator, check if the operator is a negative sign or needs to replace the previous one
    if (formulaEndWithOperator.test(resultFormula) | resultFormula === "") {
      console.log("multiple operators testing...");
      if (oper === "-") {
        setInputValue("-");
        handleFormula(oper);
        handleResultFormula(oper);
        if (resultFormula === "") {
          setResultFormula("0+-");
        }
      } else {
        let newDisplayFormula = displayFormula;
        let newResultFormula = resultFormula;
        while (formulaEndWithOperator.test(newDisplayFormula)) {
          newDisplayFormula = newDisplayFormula.slice(0, newDisplayFormula.length - 1);
          newResultFormula = newResultFormula.slice(0, newResultFormula.length - 1);
        }
        newDisplayFormula += oper;
        newResultFormula += oper;
        setDisplayFormula(newDisplayFormula);
        setResultFormula(newResultFormula);
      } 
    } else if (beginWithNegativeSign.test(nextValue)) {
      console.log("testing...");
      const negativeSignIndex = resultFormula.indexOf(nextValue);
      match = resultFormula[negativeSignIndex - 1];
      newCalValue = performCal(match, newCalValue, nextValue);

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
      match = resultFormula.match(formulaHasOperator);
      console.log(match);

      if (match) {
        newCalValue = performCal(match[1], newCalValue, nextValue);
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
    }    
  }

  const performCal = (oper, calValue, nextValue) => {
    switch(oper) {
      case "+": 
        calValue += nextValue;
        break;
      case "-":
        calValue -= nextValue;
        break;
      case "*":
        calValue *= nextValue;
        break;
      case "/":
        calValue /= nextValue;
        break;
      default:
        return calValue;
    }
    return calValue;
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

  const handleDecimal = (event) => {
    event.preventDefault();
    let newInputValue = inputValue;
    if (!newInputValue.includes(".")) {
      handleInput(event, ".")
    } 
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
    console.log(newResultFormula);
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

      <div id="formula">
        {displayFormula}
      </div>
      <div id="display">
        { isResult ? calValue: inputValue}
      </div>

      <div className="buttonWrapper">
        <button 
          id="clear" 
          onClick={handleClear}
        >
          C
        </button>

        <button 
          id="equals" 
          onClick = {(event) => handleCalculation(event, "=")}
        > 
          =
        </button>
      
        { numbers.map( num => 
          <button 
            id={num.id}
            onClick = {(event) => handleInput(event, num.number)}
          > 
            {num.number} 
          </button> )
        }


        { operators.map( oper => 
          <button 
            id={oper.id}
            onClick={(event) => handleCalculation(event, oper.operation)}
          >
            {oper.operation}
          </button>)
        }

        <button 
          id="decimal" 
          onClick={handleDecimal}
        >
          .
        </button>
      
      </div>
    </div>
  );
}

export default App;
