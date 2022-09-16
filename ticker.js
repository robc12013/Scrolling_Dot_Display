function createTickerDots() {
    dots = [];
    for (let i = 0; i < (tickerDotLength*7); i++) {
        LEDTicker.appendChild(document.createElement("div"));
        LEDTicker.lastChild.className = dotStyle;
        dots.push(LEDTicker.lastChild);
    }
}

function createMask() {
    for (let i = 1; i <= 7; i++) {
        getDot(tickerDotLength,i).style = "width: 0; margin: 0;";
    }
}

function getDot(x,y) {
    if (x < 1 || y < 1) {throw Error("Coordinates cannot be less than 1.")}
    if (x > tickerDotLength) {throw Error("X coordinate is out of range. Max is (max)");}
    if (y > 7) {throw Error("Y coordinate is out of range. Max is 7.");}
    const rowStart = [0,tickerDotLength,tickerDotLength*2,tickerDotLength*3,tickerDotLength*4,tickerDotLength*5,tickerDotLength*6];
    let dotElement = dots[rowStart[y-1]+(x-1)];
    return dotElement;
}

function turnOn(element) {
    element.className = dotOnStyle;
}

function turnOff(element) {
    element.className = dotStyle;
}

// Update the dots' state from left to right, top to bottom.
// The outer for loop loops through rows, the inner for loop
// loops throught columns within those rows.
// The inner loop checks the state of the dot to the right.
function shiftDots() {
    for (let y = 1; y <= 7; y++) {
        for (let x = 1; x < tickerDotLength; x++) {
            if (getDot(x+1,y).className == dotOnStyle) {
                turnOn(getDot(x,y));
            } else if (getDot(x+1,y).className == dotStyle) {
                turnOff(getDot(x,y));
            }
        }
    }
}

// Input a number from 0 - 127 and return a 7 element array of that number in binary.
function verticalBinary(num) {
    if (num > 127) {throw Error("Max is 127.");}
    if (num < 0) {throw Error("Min is 0.");}
    let bin = num.toString(2);
    let paddedBin = bin.padStart(7,"0");
    return paddedBin.split("");
}

// Input a 7 element binary array and the 1's will turn on the corresponding dots.
function setVerticalLine(binArray) {
    for (let i = 0; i < 7; i++) {
        if (binArray[i] == "1"){
            getDot(tickerDotLength,i+1).className = dotOnStyle;
        }
        else if (binArray[i] == "0") {
            getDot(tickerDotLength,i+1).className = dotStyle;
        }
    }
}

function printLine() {
    if (queue.length == queueCounter){
        return "Done printing queue.";
    }

    if (queue[queueCounter] == printCharSpace){
        printCharSpace();
        queueCounter++;
    }
    else {
        setVerticalLine(verticalBinary(queue[queueCounter][verticalLine]))
        verticalLine++;
    }

    if (verticalLine == wordSpaceSize){
        queueCounter++;
        verticalLine = 0;
    }
}

function printQueue(){
    verticalLine = 0;
    queueCounter = 0;
    printStatus = "";
    printInterval = setInterval(function(){
        printStatus = printLine();
        if (printStatus == "Done printing queue."){
            clearInterval(printInterval);
            spaceOutTickerAndRepeat();
        }
        else{
            shiftDots();
        }
    },shiftSpeed);
}

function spaceOutTickerAndRepeat(){
    let counter = 0;
    shiftDots();
    shiftInterval = setInterval(function(){
        shiftDots();
        counter++;
        if (counter == messageGap) {
            clearInterval(shiftInterval);
            printQueue();
        }
    },shiftSpeed);
}

function printCharSpace(){
    setVerticalLine(verticalBinary([0]));
}

function updateQueue(){
    queue = [];
    let newTickerMessage = tickerMessageInput.value.toLowerCase().split(" ");

    for (let i = 0; i < newTickerMessage.length;i++){
        for (let j = 0; j < newTickerMessage[i].length;j++){
            let indexOfLetter = charList.findIndex(letter => letter == newTickerMessage[i][j]);
            let letterToPrint = charList[indexOfLetter+1];
            queue.push(letterToPrint);
            queue.push(printCharSpace);
        }
        for (let i = 0; i < wordSpaceSize; i++) {
            queue.push(printCharSpace);
        }
    }
}

function clearTicker(){
    for (let x = 1; x <= tickerDotLength; x++){
        for ( let y = 1; y <= 7; y++){
            turnOff(getDot(x,y));
        }
    }
}

function stopTicker(){
    clearInterval(printInterval);
    clearInterval(shiftInterval);
}

function updateTickerMessage(){
    stopTicker();
    updateTickerLength();
    updateQueue();
    printQueue();
}

function updateTickerLength(){
    tickerDotLength = Number(tickerLength.value);
    if (tickerDotLength < 10 || tickerDotLength > 500){
        tickerLength.value = 50;
        updateTickerLength();
        updateQueue();
        printQueue();
        throw Error("Must be between 10 and 2000");
    }
    else{
        tickerDotLength = Number(tickerLength.value)+1;
    }
    
    messageGap = tickerDotLength-7;
    document.documentElement.style.setProperty("--tickerDotLength", tickerDotLength);
    while (LEDTicker.lastChild){
        LEDTicker.removeChild(LEDTicker.lastChild);
    }
    createTickerDots();
    createMask();
}

// MAIN
updateTickerMessageButton.addEventListener("click",updateTickerMessage);
stopTickerButton.addEventListener("click",stopTicker);

let dots = [];
let shiftSpeed = 40;
let printInterval = 0;
let shiftInterval = 0;
let verticalLine = 0;
let queueCounter = 0;
let printStatus = "";
let queue = [];
let wordSpaceSize = 5;
let tickerDotLength = Number(tickerLength.value)+1;
let messageGap = tickerDotLength-7;
document.documentElement.style.setProperty("--tickerDotLength", tickerDotLength);
let dotStyle = "dot";
let dotOnStyle = "dotOn";

updateTickerLength();
updateQueue();
printQueue();
