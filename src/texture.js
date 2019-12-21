import {Texture} from '../node_modules/three/src/textures/Texture.js';
import {
	UVMapping,
	RepeatWrapping,
	LinearFilter
} from '../node_modules/three/src/constants.js'

function FragmentSliderTexture() {

	this.canvas = document.createElement('canvas');
	this.canvas.width = 1024;
	this.canvas.height = 1024;

	Texture.call(this, this.canvas, UVMapping, RepeatWrapping, RepeatWrapping, LinearFilter, LinearFilter);

}

FragmentSliderTexture.prototype = Object.assign(Object.create(Texture.prototype), {

	constructor:FragmentSliderTexture,

	drawImage:function(image, gWidth, gHeight) {

		if (!image) return this;

		this.srcImage = image;

		var ctx = this.canvas.getContext('2d');
		var width = this.canvas.width;
		var height = this.canvas.height;

		ctx.drawImage(image, 0, 0, width, height);

		this.setAspectRatio(image, gWidth, gHeight);

		return this;

	},

	setAspectRatio:function(image, gWidth, gHeight) {

		var iWidth = image.width;
		var iHeight = image.height;

		var repeatX = gWidth * iHeight / (gHeight * iWidth);
		var repeatY = gHeight * iWidth / (gWidth * iHeight);
		var offsetX = (repeatX - 1) / 2 * -1;
		var offsetY = (repeatY - 1) / 2 * -1;

		if (repeatX > 1){
			this.repeat.set(1, repeatY);
			this.offset.set(0, offsetY);
		} else {
			this.repeat.set(repeatX, 1);
			this.offset.set(offsetX, 0);
		}

		this.updateMatrix();
		this.dispatchEvent({type:'updateUvTransform'});
		this.needsUpdate = true;

		return this;

	}

});

export default FragmentSliderTexture;
