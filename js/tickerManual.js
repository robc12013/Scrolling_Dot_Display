let dots;
let rows = [0];
let tickerDotLength = 50;
let dotStyle = "dot";
let dotOnStyle = "dotOn";
let segments = [];
let charSpace = intToBinaryArray(0);
let segmentIndex = 0;
let printInterval = 0;
let tickerSpeed = 50; //Math.abs(tickerSpeedInput.value);

function createTicker() {
    dots = [];
    for (let i = 0; i < (tickerDotLength*7); i++) {
        LEDTicker.appendChild(document.createElement("div"));
        LEDTicker.lastChild.className = "dot "+dotStyle;
        LEDTicker.lastChild.dataset.state = "off";
        dots.push(LEDTicker.lastChild);
    }
    // Set the first dot of each row into the rows array.
    for (let i = 1; i < 7; i++){
        rows.push(tickerDotLength*i);
    }
    // Set the right most column of dots to be invisible so it can
    // be used to queue char segments without the user seeing.
    for (let i = 1; i <= 7; i++) {
        getDot(tickerDotLength,i).style = "width: 0; margin: 0;";
    }
}

function getDot(x,y) {
    return dots[rows[y-1] + (x-1)];
}

function turnOn(element) {
    element.classList.add(dotOnStyle);
    element.dataset.state = "on";
}
function turnOff(element) {
    element.classList.remove(dotOnStyle);
    element.dataset.state = "off";
}

// Update the dots' state from left to right, top to bottom.
// The outer for loop loops through rows, the inner for loop
// loops throught columns within those rows.
// The inner loop checks the state of the dot to the right.
function shiftDots() {
    for (let x = 1; x < tickerDotLength; x++){
        for (let y = 1; y <= 7;y++) {
            if (getDot(x+1,y).dataset.state == "on") {
                turnOn(getDot(x,y));
            } else {
                turnOff(getDot(x,y));
            }
        }
    }
}

// Input a number from 0 - 127 and return a 7 element array of that number in binary.
function intToBinaryArray(num) {
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

function convertToSegments(message) {
    // Reset the segments.
    segments = [];
    // Populate segments array based on characters in message.
    for (let char of message){
        for (let segment in characters[char.toLowerCase()]){
            segments.push(intToBinaryArray(characters[char.toLowerCase()][segment]));
        }
        segments.push(charSpace);
    }
    // Add a full ticker length space to the message.
    for (let i = 0; i < tickerDotLength; i++){
        segments.push(charSpace);
    }
}

function printNextSegment() {
    setVerticalLine(segments[segmentIndex]);
    shiftDots();
}

// MAIN

createTicker();
convertToSegments("B");
startTicker();
