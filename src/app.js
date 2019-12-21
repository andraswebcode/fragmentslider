//import '../node_modules/three/src/polyfills.js';
//import {WebGLRenderer} from '../node_modules/three/src/renderers/WebGLRenderer.js';
import {PerspectiveCamera} from '../node_modules/three/src/cameras/PerspectiveCamera.js';
import {Scene} from '../node_modules/three/src/scenes/Scene.js';
import {_Math} from '../node_modules/three/src/math/Math.js';

import FragmentSliderItem from './item.js';
import FragmentSliderAnimation from './animation.js';
import FragmentSliderShaderMotionBuilder from './motion-builder.js';

function FragmentSlider(options) {

	options = options || {};

	this.container = options.container || document.getElementById('fragslider-container');
	this.width = options.width || this.container.offsetWidth;
	this.height = options.height || this.container.offsetHeight;
	this.itemClassName = options.itemClassName || 'fragslider-item';
	this.backgroundColor = options.backgroundColor || 0x000011;
	this.imageWidth = options.imageWidth || 1;
	this.imageHeight = options.imageHeight || 1;

	this.defaults = options.defaults || (options.defaults = {});
	this.defaults.widthSegments = options.defaults.widthSegments || 10;
	this.defaults.heightSegments = options.defaults.heightSegments || 10;
	this.defaults.fragmentShape = options.defaults.fragmentShape || 'triangle';
	this.defaults.startPosition = options.defaults.startPosition || 'default';
	this.defaults.endPosition = options.defaults.endPosition || 'default';
	this.defaults.delayIn = options.defaults.delayIn || 'default';
	this.defaults.delayOut = options.defaults.delayOut || 'default';
	this.defaults.spinningIn = options.defaults.spinningIn || 'default';
	this.defaults.spinningOut = options.defaults.spinningOut || 'default';
	this.defaults.bezier0In = options.defaults.bezier0In || 'default';
	this.defaults.bezier0Out = options.defaults.bezier0Out || 'default';
	this.defaults.bezier1In = options.defaults.bezier1In || 'default';
	this.defaults.bezier1Out = options.defaults.bezier1Out || 'default';

	this.animation = new FragmentSliderAnimation({
		duration:options.duration,
		delay:options.delay
	});

}

Object.assign(FragmentSlider.prototype, {

	constructor:FragmentSlider,

	init:function() {

		// setup renderer
		this.aspect = this.width / this.height;
		this.renderer = new THREE.WebGLRenderer();
		this.camera = new PerspectiveCamera(75, this.aspect, 0.1, 1000);
		this.scene = new Scene();

		this.renderer.setSize(this.width, this.height);
		this.renderer.setClearColor(this.backgroundColor);
		this.camera.position.z = 1;
		this.camera.lookAt(this.scene.position);

		// get datas from html attributes,
		// and put into arrays
		this._setupMotions();

		// setup canvas container
		var canvasContainer = document.createElement('div');
		canvasContainer.className = 'fragslider-canvas-container';
		canvasContainer.appendChild(this.renderer.domElement);
		this.container.appendChild(canvasContainer);

		// setup items
		this._setupItems();

		// setup animation
		this._animate();

		// setup events
		this._setUpEvents();

		// draw first frame
		this._render(this);

		return this;

	},

	goAhead:function() {
		this.animation.play();
	},

	goBack:function() {
		this.animation.play(true);
	},

	_setupItems:function() {

		this.item1 = new FragmentSliderItem({
			width:this.imageWidth,
			height:this.imageHeight,
			widthSegments:this.shapes.widthSegments[0],
			heightSegments:this.shapes.heightSegments[0],
			fragmentShape:this.shapes.fragmentShapes[0]
		});
		this.item2 = new FragmentSliderItem({
			width:this.imageWidth,
			height:this.imageHeight,
			widthSegments:this.shapes.widthSegments[1],
			heightSegments:this.shapes.heightSegments[1],
			fragmentShape:this.shapes.fragmentShapes[1]
		}).addImage(this._getImage(0));

		this.scene.add(this.item1, this.item2);

	},

	_animate:function() {

		var scope = this;
		var length = this._getItemDomElements().length;
		var widthSegments1, heightSegments1, fragmentShape1,
			widthSegments2, heightSegments2, fragmentShape2;

		this.animation.onBegin = function(counter, pendulum, reverse) {

			counter = counter - 1;
			var counter0 = _Math.euclideanModulo(counter, length);
			var counter1 = _Math.euclideanModulo(counter + 1, length);

			if (pendulum){
				if (!reverse) scope.item2.addImage(scope._getImage(counter0));
				scope.item2.increase = reverse;
				scope.item2.startPosition = reverse ? scope.motions.startPositions[counter0] : 'default';
				scope.item2.endPosition = reverse ? 'default' : scope.motions.endPositions[counter0];
				scope.item1.addImage(scope._getImage(counter1));
				scope.item1.increase = !reverse;
				scope.item1.startPosition = reverse ? 'default' : scope.motions.startPositions[counter1];
				scope.item1.endPosition = reverse ? scope.motions.endPositions[counter1] : 'default';
			} else {
				if (!reverse) scope.item1.addImage(scope._getImage(counter0));
				scope.item1.increase = reverse;
				scope.item1.startPosition = reverse ? scope.motions.startPositions[counter0] : 'default';
				scope.item1.endPosition = reverse ? 'default' : scope.motions.endPositions[counter0];
				scope.item2.addImage(scope._getImage(counter1));
				scope.item2.increase = !reverse;
				scope.item2.startPosition = reverse ? 'default' : scope.motions.startPositions[counter1];
				scope.item2.endPosition = reverse ? scope.motions.endPositions[counter1] : 'default';
			}

		};

		this.animation.onUpdate = function(value) {

			scope.item1.time = value;
			scope.item2.time = value;

			scope._render(scope);

		};

	},

	_setupMotions:function() {

		var scope = this, datas;

		this.shapes = {};
		this.shapes.widthSegments = [];
		this.shapes.heightSegments = [];
		this.shapes.fragmentShapes = [];

		this.motions = {};
		this.motions.startPositions = [];
		this.motions.endPositions = [];
		this.motions.delayIns = [];
		this.motions.delayOuts = [];
		this.motions.spinningIns = [];
		this.motions.spinningOuts = [];
		this.motions.bezier0Ins = [];
		this.motions.bezier0Outs = [];
		this.motions.bezier1Ins = [];
		this.motions.bezier1Outs = [];

		[].forEach.call(this._getItemDomElements(), function(elem) {

			datas = elem.dataset || {};

			scope.shapes.widthSegments.push(parseInt(datas.widthSegments) || scope.defaults.widthSegments);
			scope.shapes.heightSegments.push(parseInt(datas.heightSegments) || scope.defaults.heightSegments);
			scope.shapes.fragmentShapes.push(datas.fragmentShape || scope.defaults.fragmentShape);

			scope.motions.startPositions.push(datas.startPosition || scope.defaults.startPosition);
			scope.motions.endPositions.push(datas.endPosition || scope.defaults.endPosition);
			scope.motions.delayIns.push(datas.delayIn || scope.defaults.delayIn);
			scope.motions.delayOuts.push(datas.delayOut || scope.defaults.delayOut);
			scope.motions.spinningIns.push(datas.spinningIn || scope.defaults.spinningIn);
			scope.motions.spinningOuts.push(datas.spinningOut || scope.defaults.spinningOut);
			scope.motions.bezier0Ins.push(datas.bezier0In || scope.defaults.bezier0In);
			scope.motions.bezier0Outs.push(datas.bezier0Out || scope.defaults.bezier0Out);
			scope.motions.bezier1Ins.push(datas.bezier1In || scope.defaults.bezier1In);
			scope.motions.bezier1Outs.push(datas.bezier1Out || scope.defaults.bezier1Out);

		});

	},

	_setUpEvents:function() {

		var scope = this, width, height;

		function onResize() {
			width = scope.container.offsetWidth;
			height = scope.container.offsetHeight;
			scope.renderer.setSize(width, height);
			scope.camera.aspect = width / height;
			scope.camera.updateProjectionMatrix();
			scope._render(scope);
		}

		window.addEventListener('resize', onResize);

	},

	_getItemDomElements:function() {
		return this.container.getElementsByClassName(this.itemClassName);
	},

	_getImage:function(index) {
		var doms = this._getItemDomElements();
		return doms[index] && doms[index].querySelector('img');
	},

	_render:function(scope) {
		scope.renderer.render(scope.scene, scope.camera);
	}

});

FragmentSlider.ShaderMotionBuilder = FragmentSliderShaderMotionBuilder;

export default FragmentSlider;
