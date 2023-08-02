class Slider {
  constructor(element, min, max, numOfSteps, updateValueFunction, 
              options = {"reverseScale": false}) {
		this.element = element;
		this.min = min;
		this.max = max;
		this.numOfSteps = numOfSteps;
    this.updateValueFunction = updateValueFunction;
    this.sliderValue;

		this.sliderWidth = Number(window.getComputedStyle(element).width.slice(0,-2));
		this.sliderStart = Math.floor(element.getBoundingClientRect().x);

		this.steps = [];
		for (let stepPos = 0; stepPos < 101; stepPos+=(100/numOfSteps)) {
			this.steps.push(stepPos.toFixed(2));
		}

    this.values = [];
    for (let value = min; value < max+1; value+=((max-min)/numOfSteps)) {
      this.values.push(value.toFixed(2));
    }

    if (options["reverseScale"]) {
      this.values.reverse();
    }

    this.element.addEventListener("mousedown", this.#grabKnob.bind(this));
	}

  #moveSliderListener = this.#moveSlider.bind(this);
  #releaseKnobListener = this.#releaseKnob.bind(this);

  #grabKnob(mouseDownEvent) {
    this.#moveSlider(mouseDownEvent);

    document.addEventListener("mousemove", this.#moveSliderListener);
    document.addEventListener("mouseup", this.#releaseKnobListener);
  }

  #moveSlider(mouseEvent) {
		if (mouseEvent.movementY != 0){
			return undefined;
		}

    let mouseX = (((mouseEvent.clientX - this.sliderStart) / (this.sliderWidth)) * 100).toFixed(2);
    let knobPos = this.steps[Slider.#closestValue(this.steps,mouseX)];

    // If the slider value is different than it was before, update the value.
    // Meaning, only update the value if the slider has reached the next "step"
    // and not just everytime a move event occurs.
    if (this.sliderValue != this.values[this.steps.indexOf(knobPos)]) {
      this.sliderValue = this.values[this.steps.indexOf(knobPos)];
      this.element.querySelector(".innerSlider").style.width = knobPos + "%";
      this.updateValueFunction(this.values[this.steps.indexOf(knobPos)]);
    }
    
	}

  #releaseKnob() {
    document.removeEventListener("mousemove", this.#moveSliderListener);
    document.removeEventListener("mouseup", this.#releaseKnobListener);
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
