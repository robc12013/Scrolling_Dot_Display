class Ticker {
  dotRows = [];
  static #height = 7;
  #printInterval = 0;
  #segments = [];
  #segmentIndex = 0;
  #charSpace = this.#intToBinaryArray(0);

  constructor(element, length, speed, size, message) {
    this.element = element;
    this.length = length+1;
    style.setProperty("--tickerDotLength",this.length)
    this.speed = speed;
    this.size = size;
    this.message = message;
    this.dotStyle = "dotStyle1";
    this.dotOnStyle = "dotOnStyle1";

    for (let row = 0; row < Ticker.#height; row++){
      let dotRow = [];
      for (let col = 0; col < this.length; col++) {
        element.appendChild(document.createElement("div"));
        element.lastChild.className = "dot " + this.dotStyle;
        element.lastChild.dataset.state = "off";
        dotRow.push(element.lastChild);
      }
      this.dotRows.push(dotRow);
      // Set the right most column of dots to be invisible so it can
      // be used to queue char segments without the user seeing.
      this.getDot(this.length,row+1).style = "width: 0; margin: 0;";
    }

    this.#convertToSegments(message);
    this.startTicker();

  }

  startTicker() {
    if (this.#printInterval == 0) {
      this.#printInterval = setInterval(() =>{
        if (this.#segmentIndex == this.#segments.length-1) {
          this.#segmentIndex = 0;
          clearInterval(this.#printInterval);
          this.#printInterval = 0;
          this.startTicker();
        } else {
          this.#printNextSegment();
          this.#segmentIndex++;
        }
    },this.speed);
    } else {
      return "Ticker is already started";
    }
  }

  stopTicker() {

  }

  #shiftDots() {
    for (let x = 1; x < this.length; x++){
      for (let y = 1; y <= Ticker.#height; y++) {
        if (this.getDot(x+1,y).dataset.state == "on") {
          this.turnOn(this.getDot(x,y));
        } else {
          this.turnOff(this.getDot(x,y));
        }
      }
    }
  }

  #setVerticalLine(binArray) {
    for (let row = 0; row < Ticker.#height; row++) {
      let dot = this.getDot(this.length, row + 1)
      if (binArray[row] == "1"){
        this.turnOn(dot);
      }
      else if (binArray[row] == "0") {
        this.turnOff(dot);
      }
    }
  }

  #convertToSegments(message) {
    // Reset the segments.
    this.#segments = [];
    // Populate segments array based on characters in message.
    for (let char of message){
      for (let segment in characters[char.toLowerCase()]){
        this.#segments.push(this.#intToBinaryArray(characters[char.toLowerCase()][segment]));
      }
      this.#segments.push(this.#charSpace);
    }
    // Add a full ticker length space to the message.
    for (let space = 0; space < this.length; space++){
      this.#segments.push(this.#charSpace);
    }
  }

  #intToBinaryArray(num) {
    if (num > 127) {throw Error("Max is 127.");}
    if (num < 0) {throw Error("Min is 0.");}
    let bin = num.toString(2);
    let paddedBin = bin.padStart(7,"0");
    return paddedBin.split("");
  }

  #printNextSegment() {
    this.#setVerticalLine(this.#segments[this.#segmentIndex]);
    this.#shiftDots();
  }

  getDot(x,y) {
    return this.dotRows[y-1][x-1];
  }

  turnOn(element) {
    element.classList.add(this.dotOnStyle);
    element.dataset.state = "on";
  }

  turnOff(element) {
    element.classList.remove(this.dotOnStyle);
    element.dataset.state = "off";
  }

  static createTicker() {

  }
  static deleteTicker() {

  }

}


// let dots;
// let rows = [0];
// let tickerDotLength = 50;
// let dotStyle = "dot";
// let dotOnStyle = "dotOn";
// let segments = [];
// let charSpace = intToBinaryArray(0);
// let segmentIndex = 0;
// let printInterval = 0;
// let tickerSpeed = 80; //Math.abs(tickerSpeedInput.value);

// function createTicker() {
//   dots = [];
//   for (let i = 0; i < (tickerDotLength*7); i++) {
//     LEDTicker.appendChild(document.createElement("div"));
//     LEDTicker.lastChild.className = "dot "+dotStyle;
//     LEDTicker.lastChild.dataset.state = "off";
//     dots.push(LEDTicker.lastChild);
//   }
//   // Set the first dot of each row into the rows array.
//   for (let i = 1; i < 7; i++){
//     rows.push(tickerDotLength*i);
//   }
//   // Set the right most column of dots to be invisible so it can
//   // be used to queue char segments without the user seeing.
//   for (let i = 1; i <= 7; i++) {
//     getDot(tickerDotLength,i).style = "width: 0; margin: 0;";
//   }
// }

// // function getDot(x,y) {
// //   return dots[rows[y-1] + (x-1)];
// // }

// function turnOn(element) {
//   element.classList.add(dotOnStyle);
//   element.dataset.state = "on";
// }
// function turnOff(element) {
//   element.classList.remove(dotOnStyle);
//   element.dataset.state = "off";
// }

// // Update the dots' state from left to right, top to bottom.
// // The outer for loop loops through rows, the inner for loop
// // loops throught columns within those rows.
// // The inner loop checks the state of the dot to the right.
// function shiftDots() {
//   for (let x = 1; x < tickerDotLength; x++){
//     for (let y = 1; y <= 7;y++) {
//       if (getDot(x+1,y).dataset.state == "on") {
//         turnOn(getDot(x,y));
//       } else {
//         turnOff(getDot(x,y));
//       }
//     }
//   }
// }

// // Input a number from 0 - 127 and return a 7 element array of that number in binary.
// function intToBinaryArray(num) {
//   if (num > 127) {throw Error("Max is 127.");}
//   if (num < 0) {throw Error("Min is 0.");}
//   let bin = num.toString(2);
//   let paddedBin = bin.padStart(7,"0");
//   return paddedBin.split("");
// }

// // Input a 7 element binary array and the 1's will turn on the corresponding dots.
// function setVerticalLine(binArray) {
//   for (let i = 0; i < 7; i++) {
//     if (binArray[i] == "1"){
//       turnOn(getDot(tickerDotLength,i+1));
//     }
//     else if (binArray[i] == "0") {
//       turnOff(getDot(tickerDotLength,i+1));
//     }
//   }
// }

// function convertToSegments(message) {
//   // Reset the segments.
//   segments = [];
//   // Populate segments array based on characters in message.
//   for (let char of message){
//     for (let segment in characters[char.toLowerCase()]){
//       segments.push(intToBinaryArray(characters[char.toLowerCase()][segment]));
//     }
//     segments.push(charSpace);
//   }
//   // Add a full ticker length space to the message.
//   for (let i = 0; i < tickerDotLength; i++){
//     segments.push(charSpace);
//   }
// }

// function printNextSegment() {
//   setVerticalLine(segments[segmentIndex]);
//   shiftDots();
// }

// MAIN
// createTicker();
// convertToSegments("Hello World");
// startTicker();
