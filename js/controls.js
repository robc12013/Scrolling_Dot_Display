const tickerMessageInput = document.getElementById("tickerMessageInput");
const tickerLengthInput = document.getElementById("tickerLengthInput");
const initialTickerLength = Math.floor(window.innerWidth/9.6) - 6;
const stopTickerButton = document.getElementById("stopTickerButton");
const startTickerButton = document.getElementById("startTickerButton");
const updateTickerButton = document.getElementById("updateTickerButton");
const style = document.documentElement.style;

const sizeSlider = new Slider(document.getElementById("sizeSlider"), 4, 12, 8, updateTickerSize);
const speedSlider = new Slider(document.getElementById("speedSlider"), 10, 150, 6, updateTickerSpeed, {"reverseScale": true});

tickerLengthInput.value = initialTickerLength;

let ledTicker1 = new Ticker(LEDTicker, initialTickerLength, Number(speedSlider.value), Number(sizeSlider.value), tickerMessageInput.innerText);

updateTickerButton.addEventListener("click",updateTickerMessage);

function updateButtonListeners() {
	stopTickerButton.addEventListener("click",ledTicker1.stopTicker.bind(ledTicker1));
	startTickerButton.addEventListener("click",ledTicker1.startTicker.bind(ledTicker1));

	const styleButtons = document.querySelectorAll(".radio button");
	for (let button of styleButtons){
		button.addEventListener("click",ledTicker1.changeStyle.bind(ledTicker1));
		button.addEventListener("tocuhstart",ledTicker1.changeStyle.bind(ledTicker1));
	}
}

updateButtonListeners();

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
	updateButtonListeners();
}
