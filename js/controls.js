stopTickerButton.addEventListener("click",stopTicker);
startTickerButton.addEventListener("click",startTicker);

const sizeSlider = new Slider(document.getElementById("sizeSlider"), 1, 20, 19, updateTickerSize);
const speedSlider = new Slider(document.getElementById("speedSlider"), 10, 150, 6, updateTickerSpeed, {"reverseScale": true});

const style = document.documentElement.style;

function startTicker(){
	if (printInterval == 0) {
		printInterval = setInterval(() =>{
			if (segmentIndex == segments.length-1) {
				segmentIndex = 0;
				clearInterval(printInterval);
				printInterval = 0;
				startTicker();
			} else {
				printNextSegment();
				segmentIndex++;
			}
	},tickerSpeed);
	} else {
		return "Ticker is already started";
	}
}

function stopTicker() {
  clearInterval(printInterval);
  printInterval = 0;
}

function updateTickerSize(size) {
	style.setProperty("--dotSize",size+"px");
	console.log("tickerSize: ", size+"px");
}

function updateTickerSpeed(speed) {
	stopTicker();
	tickerSpeed = speed;
	startTicker();
	console.log("tickerSpeed: ", speed +"ms");
}
