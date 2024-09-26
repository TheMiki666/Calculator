/*Variables definition*/

let screen; //What appears on screen
let memory;   //Number in the memory
let decimal;  //Flag; if the number of the screen has decimal point, it changes to true
let error;    //It's true when the number is too big (overflow) or we have made a division by 0
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
    screen="0";
    screenElement.textContent=screen;
    memory=0;   
    decimal=false;  
    error=false;  
    negative=false;  
    numDigits=0; 
    operation=NO_OPERATION;
}


/**
 * Asigns the funcionaly of the buttons and the HTML element screen
 */
window.onload=function(){
    
    screenElement=document.getElementById("screen");
    clear();
    document.getElementById("clear").addEventListener("click", clear);
    
};

