const { invoke } = window.__TAURI__.core;
// import { evaluate } from '../src/math.min.js';

/*********************************************************/
/** Equation parsing - Rust **/
/*********************************************************/
async function check_is_valid_equation(equationString) {
  let isValidEquation = await invoke("check_is_valid_equation", { equationString: equationString })
  return isValidEquation;
}

/*********************************************************/
/** Equation parsing - Javascipt **/
/*********************************************************/
const ALL_OPERATORS = [
  '(',
  ')',
  '^',
  '*',
  '/',
  '+',
  '-',
];

/**
* Does the equation string contain a valid equation? 
* @param {string} equationString string containing the equation
* @returns whether the equation string contains a valid equation
*/
function is_valid_equation(equationString) {
  // For each letter in the string, check that the letter that follows it is valid.
  for (let i = 0; i < equationString.length; i++) {
      const currentLetter = equationString[i];
      let nextLetter = i+1 == equationString.length ? null : equationString[i+1];
      if(nextLetter == null) break;
      console.log(currentLetter, nextLetter);
      
      if(currentLetter == ')' || '0123456789'.includes(currentLetter)) {
          // Close parenthesis and numbers can be followed by anything.
          continue;
      } else if(ALL_OPERATORS.includes(currentLetter)) {
          // All other values must be followed by an open parenthesis or a constant
          if(nextLetter == ')' || nextLetter == '(' || '0123456789'.includes(nextLetter)) {
              continue;
          } else {
              return false;
          }
      }
  }
  
  // Check that all the parenthesis are closed.
  
  
  return true;
}

/**
 * Does the equation string contain all valid valid parenthesis? 
 * @param {string} equationString string containing the equation
 */
function has_valid_parenthesis(equationString) {
  let oparenthesis = 0;
  let cparenthesis = 0;
  let numParenthesis = 0;

  for(i = 0; i < equationString.length; i++) {
      const currentLetter = equationString[i];

      if(currentLetter == '(') {
          // Check that this parenthesis is closed.
          oparenthesis += 1;
          numParenthesis += 1;

          for(j = i + 1; j < equationString.length; j++) {
              const currentLetterNew = equationString[j];

              if(oparenthesis == cparenthesis) {
                  break;
              } else if(currentLetterNew == '(') {
                  oparenthesis += 1;
              } else if(currentLetterNew == ')') {
                  cparenthesis += 1;
              }
          }
      }
  }
}

/*********************************************************/
/** Adding event listeners. **/
/*********************************************************/
/**
 * When the window is loaded, adds functionality.
 */
window.addEventListener("DOMContentLoaded", async () => {
  let textBox = document.querySelector("#equation-input");
  let changeEquationButtom = document.querySelector('#equation-change-button');
  let equationViewerParagraph = document.querySelector('#equation-viewer-paragraph');

  // console.log(await check_is_valid_equation('(3+5)'))
  // console.log(is_valid_equation('(3+5)'));

  changeEquationButtom.addEventListener('click', (e) => {
    e.preventDefault();
    if(textBox.value === '') {
      return;
    }
    equationViewerParagraph.innerHTML = math.evaluate(textBox.value);
  });
});