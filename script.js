/*Variables definition*/


let memory;   //Number in the memory
let decimal;  //Flag; if the number of the screen has decimal point, it changes to true
let error;    //Flag; It's true when the number is too big (overflow) or we have made a division by 0
let justInMemory;   //Flag; It's true when the user has just pressed an operation or equal, but not a digit yet
let negative; //Flag;True means the number on the screen is negative
let changeSignIsPressed;  //Flag; True if you press the sign change button before you have entered a digit
let numDigits;   //Number of digits (except the decimal point or the negative simbol) that are on the screen
const MAX_NUM_OF_DIGITS=19; //Max number of digits that the calculator can manage

const NO_OPERATION=0;
const ADD=1;
const SUBST=2;
const MULTIPLY=3;
const DIVISION=4;
let nextOperation; //The operation that is in memory, that is going to be executed next_

let screenElement;  //Element Screen in the HTML code

/**
 * Deletes the screen and the memory
 */
function clear(){
    
    screenElement.textContent="0";
    memory=0;   
    decimal=false;  
    error=false;  
    negative=false;  
    justInMemory=false;
    changeSignIsPressed=false;
    numDigits=0; 
    nextOperation=NO_OPERATION;
}

/**
 * 
 * @param {string} digit digit in character format, from "0" to "9"
 * @returns true if the digit could be written
 */
function writeDigit (digit){
    ok=false;
    /*
    Three conditions to write a number:
    1. Calculator is not on error (you must press C to unblock it)
    2. You are not pressing 0 when the screen is 0 (ignore zeros at the left) and you have pressed and operation or equal just before
    3. There is room on the screen
    */
    if (!error && (digit != "0" || screenElement.textContent!="0" || justInMemory) && numDigits<MAX_NUM_OF_DIGITS){
        ok=true;
        if (justInMemory){
            screenElement.textContent="";
        }
        numDigits++;
        justInMemory=false;
        if (screenElement.textContent==="0"){
            screenElement.textContent=digit;
        }else{
            screenElement.textContent=screenElement.textContent.concat(digit);
        }
        if (changeSignIsPressed){
            changeSignIsPressed=false;
            changeSign();
        }
    }
    return ok;

}
/**
 * Eventlistener that calls the function writeDigit
 * @param {Object event} event Event wich target is the button clicked (a digit from 0 to 9)
 */
function clickDigit(event){
    writeDigit(event.target.id);
}

/**
 * Removes the last digit on the screen
 * If doesn't work when you have just pressed an operatoion or equal (can't change results, just numbers prompted by user)
 * @returns true if a digit could be removed
 */
function deleteDigit(){
    let ok=false;
    if (!error && !justInMemory && screenElement.textContent!="0"){
        ok=true;
        
        justInMemory=false;
        if (screenElement.textContent.charAt(screenElement.textContent.length-1)==="."){
            //Erase decimal point
            screenElement.textContent=screenElement.textContent.substring (0, screenElement.textContent.length-1);
            decimal=false;
            if (screenElement.textContent==="0"){
                numDigits=0;
            }
        }else if (numDigits==0){
            screenElement.textContent="0";
            negative=false;
        }else{
            screenElement.textContent=screenElement.textContent.substring (0, screenElement.textContent.length-1);
            numDigits--;
        }

        //We correct some weird results on screen
        if (screenElement.textContent==="0." || screenElement.textContent==="-0."){
            numDigits=1;
            decimal=true;
        }else if (screenElement.textContent==="" || screenElement.textContent==="-" || screenElement.textContent==="-0" ){
            screenElement.textContent="0";
            numDigits=0;
            negative=false;
            changeSignIsPressed=false;
        }
    }
    return ok;
}

/**
 * Changes the sign (positive/negavtive of the figure on the screen)
 * If it is the starting 0, or justInMemory is true, instead of changing the sign, makes the flag changeSignIsPressed true,
 * to change the sign when you press the first digit afterwards
 * @returns true if the figure on the screen has changed its sign
 */
function changeSign(){
    let ok=false;
    if (!error){
        ok=true;
        if (justInMemory || screenElement.textContent==="0"){
            changeSignIsPressed=!changeSignIsPressed;
        } else{
            if (negative){
                //Remove the sign from the screen
                screenElement.textContent=screenElement.textContent.substring(1);
            }else{
                screenElement.textContent="-".concat(screenElement.textContent);
            
            }
            negative=!negative;
        }
    }

    return ok;
}

/**
 * Tries to se a decimal point
 * @returns true if the decimal point is set
 */
function setDecimalPoint(){
    let ok=false;
    if (!error && !decimal && numDigits<MAX_NUM_OF_DIGITS){
        ok=true;
        decimal=true;
        if (!justInMemory){
            screenElement.textContent=screenElement.textContent.concat(".");
            if (screenElement.textContent==="0." || screenElement.textContent==="-0." ){
                numDigits=1;
            }
            
        }else{
            //Decimal point pressed before any digit
            justInMemory=false;
            screenElement.textContent="0.";
            numDigits=1;    //Zero on units counts as one digit
        }
    }
    
    return ok;
}

/**
 * 
 * @param {integer} operation Code of next operation:  ADD, SUBSTR, MULTIPLY DIVISION, NO_OPERATION
 * @returns true if the next operation could be done
 */
function selectNextOperation (operation){
    let ok=false;
    if (!error){
        memory=parseFloat(screenElement.textContent);
        nextOperation=operation;
        blockPrompt();
        ok=true;
    }
    return ok;
}

/**
 * Finishes the prompting of a number
 */
function blockPrompt(){
    justInMemory=true;
    changeSignIsPressed=false;
    numDigits=0;
    negative=false;
    decimal=false;
}

/**
 * Executes the operation that is on memory
 * @returns true if the operation could be done
 */
function doOperation(){
    let ok=false;
    let result;
    if (!error && nextOperation!=NO_OPERATION){
        let operator=parseFloat(screenElement.textContent);
        ok=true;
        switch (nextOperation){
            case (ADD):
                result=memory+operator;
            break;
            case (SUBST):
                result=memory-operator;
            break;
            case (MULTIPLY):
                result=memory*operator;
            break;
            case (DIVISION):
                if (operator==0){
                    //DIVISION BY ZERO
                    screenElement.textContent="ERROR";
                    error=true;
                    ok=false;
                }else{
                    result=memory/operator;
                }
            break;
        }
        //Overflow filter
        if (Math.abs(result)>=Math.pow(10,MAX_NUM_OF_DIGITS)){
            screenElement.textContent="OVERFLOW";
            error=true;
            ok=false;
        }else if (!error && result!=Math.floor (result)){
            //Decimal correction
            result=parseFloat(result.toPrecision(MAX_NUM_OF_DIGITS));            
            
            //For this exercise, we consider scientific notation aceptable
        }

        if (!error){
            screenElement.textContent=result.toString();
            memory=result;
            justInMemory=true; 

        }


    }
    
    return ok;
}

/**
 * Sets operativity to the operation buttons
 * @param {Object event} event button of operation
 */
function clickOperationButton (event){
    let button;
    switch (event.target.id){
        case "addition":
            button=ADD;
        break;
        case "substraction":
            button=SUBST;
        break;
        case "multiplication":
            button=MULTIPLY;
        break;
        case "division":
            button=DIVISION;
        break;
        case "equal":
            button=NO_OPERATION;
        break;
        
    }

    
    if (button==NO_OPERATION){  //button equal
        blockPrompt();
        doOperation();
    } else {
        selectNextOperation(button);
        if (!justInMemory){
            doOperation();
        }
    }
}


/**
 * Asigns the funcionaly of the buttons and the HTML element screen
 */
window.onload=function(){
    
    screenElement=document.getElementById("screen");
    clear();
    document.getElementById("clear").addEventListener("click", clear);
    document.getElementById("del").addEventListener("click", deleteDigit);
    document.getElementById("posNeg").addEventListener("click", changeSign);
    document.getElementById("point").addEventListener("click", setDecimalPoint);
    for (const button of document.querySelectorAll(".digit")){
        button.addEventListener("click", clickDigit);
    }
    for (const button of document.querySelectorAll(".operation")){
        button.addEventListener("click", clickOperationButton);
    }
    
};

