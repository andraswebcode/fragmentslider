import {BufferGeometry} from '../node_modules/three/src/core/BufferGeometry.js';
import {Float32BufferAttribute} from '../node_modules/three/src/core/BufferAttribute.js';
import {Vector3} from '../node_modules/three/src/math/Vector3.js';
import {Vector4} from '../node_modules/three/src/math/Vector4.js';
import {_Math} from '../node_modules/three/src/math/Math.js';

function FragmentSliderSquareBufferGeometry(width, height, widthSegments, heightSegments) {

	BufferGeometry.call(this);

	this.type = 'FragmentSliderSquareBufferGeometry';

	width = width || 1;
	height = height || 1;
	widthSegments = Math.floor(widthSegments) || 10;
	heightSegments = Math.floor(heightSegments) || 10;

	this.parameters = {
		width:width,
		height:height,
		widthSegments:widthSegments,
		heightSegments:heightSegments
	};

	var indices = [];
	var vertices = [];
	var restores = [];
	var randoms = [];
	var uvs = [];

	var ix, iy, v, r, offset;

	var halfWidth = width / 2,
		halfHeight = height / 2,
		segmentWidth = width / widthSegments,
		segmentHeight = height / heightSegments,
		halfSegmentWidth = segmentWidth / 2,
		halfSegmentHeight = segmentHeight / 2;

	var ux = 1 / widthSegments,
		uy = 1 / heightSegments;

	for (iy = 0, offset = 0; iy < heightSegments; iy++){
		for (ix = 0; ix < widthSegments; ix++, offset += 4){

			v = new Vector3(
				ix * segmentWidth - halfWidth + halfSegmentWidth,
				iy * segmentHeight - halfHeight + halfSegmentHeight,
				0
			);

			r = new Vector4(
				_Math.randFloatSpread(width * 2),
				_Math.randFloatSpread(height * 2),
				_Math.randFloatSpread(width * 2),
				Math.random()
			);

			// positions

			vertices.push(
				- halfSegmentWidth,
				halfSegmentHeight,
				0,
				halfSegmentWidth,
				halfSegmentHeight,
				0,
				- halfSegmentWidth,
				- halfSegmentHeight,
				0,
				halfSegmentWidth,
				- halfSegmentHeight,
				0
			);

			// restores

			restores.push(
				v.x, v.y, v.z,
				v.x, v.y, v.z,
				v.x, v.y, v.z,
				v.x, v.y, v.z
			);

			// randoms

			randoms.push(
				r.x, r.y, r.z, r.w,
				r.x, r.y, r.z, r.w,
				r.x, r.y, r.z, r.w,
				r.x, r.y, r.z, r.w
			);

			// uvs

			uvs.push(
				ix * ux, (iy + 1) * uy,
				(ix + 1) * ux, (iy + 1) * uy,
				ix * ux, iy * uy,
				(ix + 1) * ux, iy * uy
			);

			// indices

			indices.push(
				0 + offset, 2 + offset, 1 + offset,
				2 + offset, 3 + offset, 1 + offset
			);

		}
	}

	this.setIndex(indices);

	this.setAttribute('position', new Float32BufferAttribute(vertices, 3));
	this.setAttribute('restore', new Float32BufferAttribute(restores, 3));
	this.setAttribute('random', new Float32BufferAttribute(randoms, 4));
	this.setAttribute('uv', new Float32BufferAttribute(uvs, 2));

}

FragmentSliderSquareBufferGeometry.prototype = Object.assign(Object.create(BufferGeometry.prototype), {

	constructor:FragmentSliderSquareBufferGeometry

});

export default FragmentSliderSquareBufferGeometry;
