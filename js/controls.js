let tickerMessageInput = document.getElementById("tickerMessageInput");
let tickerLengthInput = document.getElementById("tickerLengthInput");

let initialTickerLength = Math.floor(window.innerWidth/10) - 5;
tickerLengthInput.value = initialTickerLength;

const sizeSlider = new Slider(document.getElementById("sizeSlider"), 4, 12, 8, updateTickerSize);
const speedSlider = new Slider(document.getElementById("speedSlider"), 10, 150, 6, updateTickerSpeed, {"reverseScale": true});

let ledTicker1 = new Ticker(LEDTicker, initialTickerLength, Number(speedSlider.value), Number(sizeSlider.value), tickerMessageInput.innerText);

stopTickerButton.addEventListener("click",ledTicker1.stopTicker.bind(ledTicker1));
startTickerButton.addEventListener("click",ledTicker1.startTicker.bind(ledTicker1));
updateTickerButton.addEventListener("click",updateTickerMessage);

style1Button.addEventListener("click",ledTicker1.changeStyle.bind(ledTicker1));
style2Button.addEventListener("click",ledTicker1.changeStyle.bind(ledTicker1));
style3Button.addEventListener("click",ledTicker1.changeStyle.bind(ledTicker1));
style4Button.addEventListener("click",ledTicker1.changeStyle.bind(ledTicker1));

const style = document.documentElement.style;

function updateTickerSize(size) {
	style.setProperty("--dotSize",size+"px");
}

function updateTickerSpeed(speed) {
	ledTicker1.stopTicker();
	ledTicker1.speed = speed;
	ledTicker1.startTicker();
}

function updateTickerMessage(message) {
	ledTicker1.deleteTicker();
	ledTicker1 = new Ticker(LEDTicker, Number(tickerLengthInput.value), Number(speedSlider.value), Number(sizeSlider.value), 
	tickerMessageInput.innerText, {dotStyle: ledTicker1.dotStyle, dotOnStyle: ledTicker1.dotOnStyle});
	stopTickerButton.addEventListener("click",ledTicker1.stopTicker.bind(ledTicker1));
	startTickerButton.addEventListener("click",ledTicker1.startTicker.bind(ledTicker1));
	style1Button.addEventListener("click",ledTicker1.changeStyle.bind(ledTicker1));
	style2Button.addEventListener("click",ledTicker1.changeStyle.bind(ledTicker1));
	style3Button.addEventListener("click",ledTicker1.changeStyle.bind(ledTicker1));
	style4Button.addEventListener("click",ledTicker1.changeStyle.bind(ledTicker1));
}
