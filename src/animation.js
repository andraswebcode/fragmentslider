function FragmentSliderAnimation(parameters) {

	var scope = this;
	parameters = parameters || {};

	this.duration = parameters.duration !== undefined ? parameters.duration : 1000;
	this.delay = parameters.delay !== undefined ? parameters.delay : 500;

	this._start = 0;
	this._progress = 0;
	this._value = 0;
	this._counter = 0;
	this._reverse = false;
	this._pendulum = false;
	this._active = false;
	this._beginCallback = function() {};
	this._updateCallback = function() {};

	this._render = function render(timeStamp) {

		if (scope._start === 0){
			scope._start = timeStamp;
			scope._active = true;
		}

		scope._progress = timeStamp - scope._start;
		scope._value = scope._reverse ?
		Math.max(((scope._progress / scope.duration) * - 1) + 1, 0) :
		Math.min(scope._progress / scope.duration, 1);

		if (scope._progress < scope.duration){
			requestAnimationFrame(render);
		} else {
			scope._active = false;
		}
		scope._updateCallback(scope._value);

	};

}

Object.assign(FragmentSliderAnimation.prototype, {

	constructor:FragmentSliderAnimation,

	play:function(reverse) {

		if (this._active){
			return;
		}

		this._reverse = !!reverse;
		this._pendulum = !this._pendulum;
		if (this._reverse){
			this._counter--;
		} else {
			this._counter++;
		}

		this._beginCallback(this._counter, this._pendulum, this._reverse);

		var scope = this;

		setTimeout(function() {
			scope._start = 0;
			requestAnimationFrame(scope._render);
		}, scope.delay);

	}

});

Object.defineProperties(FragmentSliderAnimation.prototype, {

	onBegin:{
		set:function(callback) {
			this._beginCallback = callback;
		}
	},

	onUpdate:{
		set:function(callback) {
			this._updateCallback = callback;
		}
	}

});

export default FragmentSliderAnimation;
