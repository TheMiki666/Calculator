/*Variables definition*/


let memory;   //Number in the memory
let decimal;  //Flag; if the number of the screen has decimal point, it changes to true
let error;    //Flag; It's true when the number is too big (overflow) or we have made a division by 0
let justInMemory;   //Flag; It's true when the user has just pressed an operation or equal, but not a digit yet
let negative; //True means the number on the screen is negative
let numDigits;   //Number of digits (except the decimal point or the negative simbol) that are on the screen
const MAX_NUM_OF_DIGITS=10; //Max number of digits that the calculator can manage

const NO_OPERATION=0;
const ADD=1;
const SUBST=2;
const MULTIPLY=3;
const DIVISION=4;
let operation; //The operation that is in memory, that is going to be executed next_

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
    numDigits=0; 
    operation=NO_OPERATION;
}

/**
 * 
 * @param {*} digit digit in character format, from "0" to "9"
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
        numDigits++;
        justInMemory=false;
        if (screenElement.textContent==="0"){
            screenElement.textContent=digit;
        }else{
            screenElement.textContent=screenElement.textContent.concat(digit);
        }
    }
    return ok;

}
/**
 * Eventlistener that calls the function writeDigit
 * @param {*} event Event wich target is the button clicked (a digit from 0 to 9)
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
        numDigits--;
        justInMemory=false;
        if (numDigits==0){
            screenElement.textContent="0";
        }else{
            screenElement.textContent=screenElement.textContent.substring (0, screenElement.textContent.length-1);
        }

    }
    
    return ok;
}


/**
 * Asigns the funcionaly of the buttons and the HTML element screen
 */
window.onload=function(){
    
    screenElement=document.getElementById("screen");
    clear();
    document.getElementById("clear").addEventListener("click", clear);
    document.getElementById("del").addEventListener("click", deleteDigit);
    for (const button of document.querySelectorAll(".digit")){
        button.addEventListener("click", clickDigit);
    }
    
};

