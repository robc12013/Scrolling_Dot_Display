function createTickerDots() {
    for (let i = 0; i < 350; i++) {
        LEDTicker.appendChild(document.createElement("div"));
        LEDTicker.lastChild.className = dotStyle;
        dots.push(LEDTicker.lastChild);
    }
}

function createMask() {
    for (let i = 1; i <= 7; i++) {
        getDot(50,i).style = "width: 0px;";
    }
}

function getDot(x,y) {
    if (x < 1 || y < 1) {throw Error("Coordinates cannot be less than 1.")}
    if (x > 50) {throw Error("X coordinate is out of range. Max is 50.");}
    if (y > 7) {throw Error("Y coordinate is out of range. Max is 7.");}
    const rows = [0,50,100,150,200,250,300];
    dotElement = dots[rows[y-1]+(x-1)];
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
        for (let x = 1; x < 50; x++) {
            if (getDot(x+1,y).className == dotOnStyle) {
                turnOn(getDot(x,y));
            } else if (getDot(x+1,y).className == dotStyle) {
                turnOff(getDot(x,y));
            }
        }
        turnOff(getDot(50,y));
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
        getDot(50,i+1).className = dotOnStyle;
        }
        else if (binArray[i] == "0") {
        getDot(50,i+1).className = dotStyle;
        }
    }
}

function printLine() {
    if (queue.length == queueCounter){
        return "Done printing queue.";
    }
    if (queue[queueCounter] == printCharSpace){
        printCharSpace();
        printCounter++;
        queueCounter++;
    }
    else {
        setVerticalLine(verticalBinary(queue[queueCounter][lineCounter]))
        printCounter++;
        lineCounter++;
    }
    if (lineCounter == 5){
        queueCounter++;
        lineCounter = 0;
    }
}

function printQueue(){
    lineCounter = 0;
    queueCounter = 0;
    printCounter = 0;
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
    queueIndex = 0;
    let newTickerMessage = tickerMessage.value.toLowerCase().split(" ");

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

function updateTickerMessage(){
    clearInterval(printInterval);
    clearInterval(shiftInterval);
    clearTicker();
    updateQueue();
    printQueue();
}

function clearTicker(){
    for (let x = 1; x <= 50; x++){
        for ( let y = 1; y <= 7; y++){
            turnOff(getDot(x,y));
        }
    }
}

function stopTicker(){
    clearInterval(printInterval);
    clearInterval(shiftInterval);
}

// MAIN
updateTickerMessageButton.addEventListener("click",updateTickerMessage);
stopTickerButton.addEventListener("click",stopTicker);

let dots = [];
let shiftSpeed = 40;
let printInterval = 0;
let shiftInterval = 0;
let lineCounter = 0;
let queueCounter = 0;
let printCounter = 0;
let printStatus = "";
let queue = [];
let queueIndex = 0;
let messageGap = 46;
let wordSpaceSize = 5;

let dotStyle = "dot";
let dotOnStyle = "dotOn";

createTickerDots();
createMask();
updateQueue();
printQueue();






