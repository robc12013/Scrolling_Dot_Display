class Slider {
  constructor(element, min, max, numOfSteps, valueCallback, 
              options = {"reverseScale": false}) {
		this.element = element;
		this.min = min;
		this.max = max;
		this.numOfSteps = numOfSteps;
    this.valueCallback = valueCallback;
    this.innerSlider = this.element.querySelector(".innerSlider");

		this.steps = [];
		for (let stepPos = 0; stepPos < 101; stepPos+=(100/numOfSteps)) {
			this.steps.push(stepPos.toFixed(2));
		}

    this.values = [];
    for (let value = min; value <= max; value+=((max-min)/numOfSteps)) {
      this.values.push(value.toFixed(2));
    }

    this.value = this.values[this.steps.indexOf(Number(this.innerSlider.style.width.slice(0,-1)).toFixed(2))];

    if (options["reverseScale"]) {
      this.values.reverse();
    }

    this.element.addEventListener("mousedown", this.#grabKnob.bind(this));
    this.element.addEventListener("touchstart", this.#grabKnob.bind(this));
	}

  get #width() {
    return Number(window.getComputedStyle(this.element).width.slice(0,-2));
  }

  get #start() {
    return Math.floor(this.element.getBoundingClientRect().x + window.scrollX);
  }

  #moveSliderListener = this.#updateValue.bind(this);
  #releaseKnobListener = this.#releaseKnob.bind(this);

  #grabKnob(grabStartEvent) {
    this.#updateValue(grabStartEvent);

    document.addEventListener("mousemove", this.#moveSliderListener);
    document.addEventListener("mouseup", this.#releaseKnobListener);

    document.addEventListener("touchmove", this.#moveSliderListener);
    document.addEventListener("touchend", this.#releaseKnobListener);
  }

  #updateValue(grabEvent) {
    grabEvent.preventDefault();
    // if (grabEvent.movementY != 0){
		// 	return undefined;
		// }

    let grabEventPageX;

    if (grabEvent.type == "touchstart" || grabEvent.type == "touchmove") {
      grabEventPageX = grabEvent.touches["0"].pageX;
    }

    if (grabEvent.type == "mousedown" || grabEvent.type == "mousemove") {
      grabEventPageX = grabEvent.pageX; 
    }

    let grabX = (((grabEventPageX - this.#start) / (this.#width)) * 100).toFixed(2);
    let knobPos = this.steps[Slider.#closestValue(this.steps,grabX)];

    // If the slider value is different than it was before, update the value.
    // Meaning, only update the value if the slider has reached the next "step"
    // and not just everytime a move event occurs.
    if (this.value != this.values[this.steps.indexOf(knobPos)]) {
      this.value = this.values[this.steps.indexOf(knobPos)];
      this.innerSlider.style.width = knobPos + "%";
      this.valueCallback(this.value);
    }
    
	}

  #releaseKnob() {
    document.removeEventListener("mousemove", this.#moveSliderListener);
    document.removeEventListener("mouseup", this.#releaseKnobListener);

    document.removeEventListener("touchmove", this.#moveSliderListener);
    document.removeEventListener("touchend", this.#releaseKnobListener);
  }

	get showSliderDetail() {
		console.log(`element: ${this.element}\nmin: ${this.min}\nmax: ${this.max}\nnumOfSteps: ${this.numOfSteps}\nsteps: ${this.steps}\nvalues: ${this.values}`);
	}

	static #closestValue(array, value) {
		let closeness = [];
		for (let item of array) {
			closeness.push(Math.abs(value - item));
		}
		return closeness.indexOf(Math.min(...closeness));
	} 
}
