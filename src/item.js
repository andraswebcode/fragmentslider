import {Mesh} from '../node_modules/three/src/objects/Mesh.js';

import FragmentSliderTriangleBufferGeometry from './geometry-triangle.js';
import FragmentSliderSquareBufferGeometry from './geometry-square.js';
import FragmentSliderMaterial from './material.js';
import FragmentSliderShaderMotionBuilder from './motion-builder.js';

function FragmentSliderItem(parameters) {

	parameters = parameters || {};

	var geometry = (parameters.fragmentShape === 'square') ?
	new FragmentSliderSquareBufferGeometry(
		parameters.width,
		parameters.height,
		parameters.widthSegments,
		parameters.heightSegments
	) :
	new FragmentSliderTriangleBufferGeometry(
		parameters.width,
		parameters.height,
		parameters.widthSegments,
		parameters.heightSegments
	);

	var material = new FragmentSliderMaterial();

	Mesh.call(this, geometry, material);

	this.type = 'FragmentSliderItem';

}

FragmentSliderItem.prototype = Object.assign(Object.create(Mesh.prototype), {

	constructor:FragmentSliderItem,

	addImage:function(image) {

		var gWidth = this.geometry.parameters.width;
		var gHeight = this.geometry.parameters.height;

		this.material.uniforms.map.value.drawImage(image, gWidth, gHeight);

		return this;

	}

});

Object.defineProperties(FragmentSliderItem.prototype, {

	time:{
		set:function(v) {
			this.material.uniforms.time.value = v;
		}
	},
	startPosition:{
		set:function(name) {
			this.material.uniforms.startPosition.value = FragmentSliderShaderMotionBuilder.getIndexByName('position', name);
		}
	},
	endPosition:{
		set:function(name) {
			this.material.uniforms.endPosition.value = FragmentSliderShaderMotionBuilder.getIndexByName('position', name);
		}
	},
	delay:{
		set:function(name) {
			this.material.uniforms.delay.value = FragmentSliderShaderMotionBuilder.getIndexByName('delay', name);
		}
	},
	spinning:{
		set:function(name) {
			this.material.uniforms.spinning.value = FragmentSliderShaderMotionBuilder.getIndexByName('spinning', name);
		}
	},
	easing:{
		set:function(name) {
			this.material.uniforms.easing.value = FragmentSliderShaderMotionBuilder.getIndexByName('easing', name);
		}
	},
	increase:{
		set:function(v) {
			this.material.uniforms.increase.value = v;
		}
	},
	bezier0:{
		set:function(name) {
			this.material.uniforms.bezier0.value = FragmentSliderShaderMotionBuilder.getIndexByName('position', name);
		}
	},
	bezier1:{
		set:function(name) {
			this.material.uniforms.bezier1.value = FragmentSliderShaderMotionBuilder.getIndexByName('position', name);
		}
	}

});

export default FragmentSliderItem;
