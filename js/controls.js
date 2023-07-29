stopTickerButton.addEventListener("click",stopTicker);
startTickerButton.addEventListener("click",startTicker);
// tickerSpeedInput.addEventListener("input",updateTickerSpeed);
speedSlider.addEventListener("mousedown",adjustKnob);

const styleSet = document.documentElement.style.setProperty;

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

// function updateTickerSpeed(){
//     stopTicker();
//     tickerSpeed = Math.abs(tickerSpeedInput.value);
//     startTicker();
// }




function adjustKnob(event) {
	console.log("mousedown");

	moveSlider(event);

	document.addEventListener("mousemove",moveSlider);
	document.addEventListener("mouseup", function releaseKnob() {
		console.log("mouseup");
		document.removeEventListener("mousemove",moveSlider);
		document.removeEventListener("mouseup",releaseKnob);
	});
    
}



let sliderSteps = 6;
let steps = [];
for (let stepPos = 0; stepPos < 101; stepPos+=(100/sliderSteps)) {
	steps.push(stepPos);
}

// for (let item in notches.children) {
// 	notches.children[item].style = `margin-left: ${100/sliderSteps}%`;
// }

function moveSlider(event) {
	if (event.movementY != 0) {
		return;
	}

	let sliderWidth = Number(window.getComputedStyle(speedSlider).width.slice(0,-2));
	let sliderStart = Math.floor(speedSlider.getBoundingClientRect().x);
	let mouseX = (((event.clientX - sliderStart)/sliderWidth) * 100).toFixed(2);
	let knobPos = steps[closestValue(steps,mouseX)];

	innerSlider.style.width = knobPos + "%";

}

function closestValue(array, value) {
	let closeness = [];
	for (let item of array) {
		closeness.push(Math.abs(value - item));
	}
	return closeness.indexOf(Math.min(...closeness));
} 
