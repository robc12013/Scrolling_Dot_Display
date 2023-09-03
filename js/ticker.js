class Ticker {
  dotRows = [];
  static #height = 7;
  #printInterval = 0;
  #segments = [];
  #segmentIndex = 0;
  #charSpace = this.#intToBinaryArray(0);
  #style = document.documentElement.style;

  constructor(element, length, speed, size, message, options = {dotStyle: "dotStyle1", dotOnStyle: "dotOnStyle1"}) {
    this.element = element;
    this.length = length+1;
    this.#style.setProperty("--tickerDotLength",this.length)
    this.speed = speed;
    this.size = size;
    this.#style.setProperty("--dotSize",this.size+"px");
    this.message = message;
    this.dotStyle = options.dotStyle;
    this.dotOnStyle = options.dotOnStyle;

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
    clearInterval(this.#printInterval);
    this.#printInterval = 0;
  }

  #shiftDots() {
    for (let x = 1; x < this.length; x++){
      for (let y = 1; y <= Ticker.#height; y++) {
        let currentDot = this.getDot(x,y);
        let nextDot = this.getDot(x+1,y);
        if (nextDot.dataset.state == "on") {
          this.turnOn(currentDot);
        } else if (nextDot.dataset.state == "off" && currentDot.dataset.state == "on") {
          this.turnOff(currentDot);
        }
      }
    }
  }

  #setVerticalLine(binArray) {
    for (let row = 0; row < Ticker.#height; row++) {
      let dot = this.getDot(this.length, row + 1)
      if (binArray[row] == "1"){
        this.turnOn(dot);
      } else if (binArray[row] == "0") {
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

  changeStyle(event) {
    const styleButtons = document.querySelectorAll(".radio button");
    for (let button of styleButtons) {
      button.classList.remove("selected");
    }
    event.target.classList.add("selected");

    switch (event.target) {
      case style1Button:
        this.dotStyle = "dotStyle1";
        this.dotOnStyle = "dotOnStyle1";
        this.element.className = "LEDTicker";
        break;
      case style2Button:
        this.dotStyle = "dotStyle2";
        this.dotOnStyle = "dotOnStyle2";
        this.element.className = "LEDTicker LEDTickerStyle2";
        break;
      case style3Button:
        this.dotStyle = "dotStyle3";
        this.dotOnStyle = "dotOnStyle3";
        this.element.className = "LEDTicker LEDTickerStyle3";
        break;
      case style4Button:
        this.dotStyle = "dotStyle4";
        this.dotOnStyle = "dotOnStyle4";
        this.element.className = "LEDTicker LEDTickerStyle4";
        break;
      default:
        console.log("Unknown style.");
    }

    for (let row of this.dotRows) {
      for (let dot of row){
        if (dot.dataset.state == "on") {
          dot.className = `dot ${this.dotStyle} ${this.dotOnStyle}`;
        } else {
          dot.className = `dot ${this.dotStyle}`;
        }
      }
    }
  }
  
  deleteTicker() {
    this.stopTicker();
    while (this.element.lastChild) {
      this.element.removeChild(this.element.lastChild)
    }
  }

}
