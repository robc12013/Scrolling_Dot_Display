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
    if (x > tickerDotLength){
        throw Error("X coordinate is out of range. Max is "+tickerDotLength);
    }
    if (y > 7) {throw Error("Y coordinate is out of range. Max is 7.");}
    const rowStarts = [0];
    for (let i = 1; i < 7; i++){
        rowStarts.push(tickerDotLength*i);
    }
    let dotElement = dots[rowStarts[y-1] + (x-1)];
    return dotElement;
}

function turnOn(element) {
    element.classList.add(dotOnStyle);
}
function turnOff(element) {
    element.classList.remove(dotOnStyle);
}

// Update the dots' state from left to right, top to bottom.
// The outer for loop loops through rows, the inner for loop
// loops throught columns within those rows.
// The inner loop checks the state of the dot to the right.
function shiftDots() {
    for (let x = 1; x < tickerDotLength; x++){
        for (let y = 1; y <= 7;y++) {
            if (getDot(x+1,y).className.includes(dotOnStyle)) {
                turnOn(getDot(x,y));
            } else if (!getDot(x+1,y).className.includes(dotOnStyle)) {
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
            turnOn(getDot(tickerDotLength,i+1));
        }
        else if (binArray[i] == "0") {
            turnOff(getDot(tickerDotLength,i+1));
        }
    }
}

function printLine() {
    if (queue.length == queueCounter){
        return "Done printing queue.";
    }

    if (queue[queueCounter] == "printCharSpace"){
        printCharSpace();
        queueCounter++;
    }
    else {
        let intTickerSegment = queue[queueCounter][verticalLine];
        let binTickerSegment = verticalBinary(intTickerSegment);
        setVerticalLine(binTickerSegment);
        verticalLine++;
        console.log("print");
    }

    if (verticalLine == wordSpaceSize){
        queueCounter++;
        verticalLine = 0;
    }
}

function printQueue(){
    verticalLine = 0;
    queueCounter = 0;
    printInterval = setInterval(function(){
        let printStatus = printLine();
        if (printStatus == "Done printing queue."){
            clearInterval(printInterval);
            spaceOutTickerAndPrint();
        }
        else{
            shiftDots();
        }
    },shiftSpeed);
}

function continuePrint(){
    printInterval = setInterval(function(){
        let printStatus = printLine();
        if (printStatus == "Done printing queue."){
            clearInterval(printInterval);
            spaceOutTickerAndPrint();
        }
        else{
            shiftDots();
        }
    },shiftSpeed);
}

function spaceOutTickerAndPrint(){
    shiftDots();
    spaceCounter++;
    shiftInterval = setInterval(function(){
        if (spaceCounter > messageGap) {
            clearInterval(shiftInterval);
            spaceCounter = 0;
            printQueue();
        }
        else{
            shiftDots();
            spaceCounter++;
        }
    },shiftSpeed);
}

function printCharSpace(){
        setVerticalLine(verticalBinary([0]));
}

function updateQueue(){
    queue = [];
    let newTickerMessage = tickerMessageInput.innerText.toLowerCase().split(/\s/);
    for (let i = 0; i < newTickerMessage.length;i++){
        if(newTickerMessage[i] == ""){
            continue;
        }
        for (let j = 0; j < newTickerMessage[i].length;j++){
            let indexOfLetter = charList.findIndex(letter => letter == newTickerMessage[i][j]);
            let letterToPrint = charList[indexOfLetter+1];
            queue.push(letterToPrint);
            queue.push(printCharSpace.name);
        }
        for (let i = 0; i < wordSpaceSize-1; i++) {
            queue.push(printCharSpace.name);
        }
    }
    return newTickerMessage;
}

function stopTicker(){
    clearInterval(printInterval);
    clearInterval(shiftInterval);
}

function deleteAllDots(){
    while (LEDTicker.lastChild){
        LEDTicker.removeChild(LEDTicker.lastChild);
    }
}

function updateTickerMessage(){
    stopTicker();
    deleteAllDots();
    updateTickerLength(Number(tickerLengthInput.value));
    createTickerDots();
    createMask();
    updateQueue();
    printQueue();
}

function updateTickerLength(length){
    if (length < 10){
        tickerLengthInput.value = 10;
        updateTickerMessage();
        throw Error("Must be between 10 and 500");
    }
    if (length > 500){
        tickerLengthInput.value = 500;
        updateTickerMessage();
        throw Error("Must be between 10 and 500");
    }
    else{
        tickerDotLength = length+1;
        messageGap = tickerDotLength-6;
        tickerLengthInput.value = length;
        document.documentElement.style.setProperty("--tickerDotLength", tickerDotLength);
    }
}

function updateTickerSize(){
    document.documentElement.style.setProperty("--dotSize",tickerSizeInput.value+"px");
}

function updateTickerSpeed(){
    stopTicker();
    shiftSpeed = Math.abs(tickerSpeedInput.value);
    continuePrint();
}

// MAIN
updateTickerButton.addEventListener("click",updateTickerMessage);
stopTickerButton.addEventListener("click",stopTicker);
tickerSizeInput.addEventListener("input",updateTickerSize);
tickerSpeedInput.addEventListener("input",updateTickerSpeed);

let dots, printInterval, shiftInterval, verticalLine, queueCounter, 
    queue, messageGap, shiftSpeed, tickerDotLength;

let spaceCounter = 0;
const wordSpaceSize = 5;
let dotStyle = "dot";
let dotOnStyle = "dotOn";

// Automatically create the ticker at an appropriate size for the screen.
updateTickerLength(Math.floor(window.innerWidth/14)-5)
updateTickerMessage();
updateTickerSize();
updateTickerSpeed();
