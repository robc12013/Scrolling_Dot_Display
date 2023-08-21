let ledTicker1 = new Ticker(LEDTicker, 1000, 60, 10, "Hello");

stopTickerButton.addEventListener("click",ledTicker1.stopTicker.bind(ledTicker1));
startTickerButton.addEventListener("click",ledTicker1.startTicker.bind(ledTicker1));

const sizeSlider = new Slider(document.getElementById("sizeSlider"), 1, 20, 19, updateTickerSize);
const speedSlider = new Slider(document.getElementById("speedSlider"), 10, 150, 6, updateTickerSpeed, {"reverseScale": true});

const style = document.documentElement.style;

function updateTickerSize(size) {
	style.setProperty("--dotSize",size+"px");
	// console.log("tickerSize: ", size+"px");
}

function updateTickerSpeed(speed) {
	ledTicker1.stopTicker();
	ledTicker1.speed = speed;
	ledTicker1.startTicker();
	// console.log("tickerSpeed: ", speed +"ms");
}
