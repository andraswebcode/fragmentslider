import {BufferGeometry} from '../node_modules/three/src/core/BufferGeometry.js';
import {Float32BufferAttribute} from '../node_modules/three/src/core/BufferAttribute.js';
import {Vector3} from '../node_modules/three/src/math/Vector3.js';
import {Vector4} from '../node_modules/three/src/math/Vector4.js';
import {_Math} from '../node_modules/three/src/math/Math.js';

function FragmentSliderTriangleBufferGeometry(width, height, widthSegments, heightSegments) {

	BufferGeometry.call(this);

	this.type = 'FragmentSliderTriangleBufferGeometry';

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

	var vertices = [];
	var restores = [];
	var randoms = [];
	var uvs = [];

	var ix, iy, v1, v2, r1, r2;

	var halfWidth = width / 2,
		halfHeight = height / 2,
		segmentWidth = width / widthSegments,
		segmentHeight = height / heightSegments,
		halfSegmentWidth = segmentWidth / 2,
		halfSegmentHeight = segmentHeight / 2;

	var cx1 = (halfSegmentWidth - halfSegmentWidth - halfSegmentWidth) / 3,
		cy1 = (halfSegmentHeight - halfSegmentHeight + halfSegmentHeight) / 3,
		cx2 = (halfSegmentWidth + halfSegmentWidth - halfSegmentWidth) / 3,
		cy2 = (halfSegmentHeight - halfSegmentHeight - halfSegmentHeight) / 3;

	var ux = 1 / widthSegments,
		uy = 1 / heightSegments;

	for (iy = 0; iy < heightSegments; iy++){
		for (ix = 0; ix < widthSegments; ix++){

			v1 = new Vector3(
				ix * segmentWidth - halfWidth + halfSegmentWidth + cx1,
				iy * segmentHeight - halfHeight + halfSegmentHeight + cy1,
				0
			);

			v2 = new Vector3(
				ix * segmentWidth - halfWidth + halfSegmentWidth + cx2,
				iy * segmentHeight - halfHeight + halfSegmentHeight + cy2,
				0
			);

			r1 = new Vector4(
				_Math.randFloatSpread(width * 2),
				_Math.randFloatSpread(height * 2),
				_Math.randFloatSpread(width * 2),
				Math.random()
			);

			r2 = new Vector4(
				_Math.randFloatSpread(width * 2),
				_Math.randFloatSpread(height * 2),
				_Math.randFloatSpread(width * 2),
				Math.random()
			);

			// positions

			vertices.push(
				// face 1
				- halfSegmentWidth - cx1,
				halfSegmentHeight - cy1,
				0,
				- halfSegmentWidth - cx1,
				- halfSegmentHeight - cy1,
				0,
				halfSegmentWidth - cx1,
				halfSegmentHeight - cy1,
				0,
				// face 2
				- halfSegmentWidth - cx2,
				- halfSegmentHeight - cy2,
				0,
				halfSegmentWidth - cx2,
				- halfSegmentHeight - cy2,
				0,
				halfSegmentWidth - cx2,
				halfSegmentHeight - cy2,
				0
			);

			// restores

			restores.push(
				v1.x, v1.y, v1.z,
				v1.x, v1.y, v1.z,
				v1.x, v1.y, v1.z,
				v2.x, v2.y, v2.z,
				v2.x, v2.y, v2.z,
				v2.x, v2.y, v2.z,
			);

			// randoms

			randoms.push(
				r1.x, r1.y, r1.z, r1.w,
				r1.x, r1.y, r1.z, r1.w,
				r1.x, r1.y, r1.z, r1.w,
				r2.x, r2.y, r2.z, r2.w,
				r2.x, r2.y, r2.z, r2.w,
				r2.x, r2.y, r2.z, r2.w
			);

			// uvs

			uvs.push(
				ix * ux, (iy + 1) * uy,
				ix * ux, iy * uy,
				(ix + 1) * ux, (iy + 1) * uy,
				ix * ux, iy * uy,
				(ix + 1) * ux, iy * uy,
				(ix + 1) * ux, (iy + 1) * uy
			);

		}
	}

	this.setAttribute('position', new Float32BufferAttribute(vertices, 3));
	this.setAttribute('restore', new Float32BufferAttribute(restores, 3));
	this.setAttribute('random', new Float32BufferAttribute(randoms, 4));
	this.setAttribute('uv', new Float32BufferAttribute(uvs, 2));

}

FragmentSliderTriangleBufferGeometry.prototype = Object.assign(Object.create(BufferGeometry.prototype), {

	constructor:FragmentSliderTriangleBufferGeometry

});

export default FragmentSliderTriangleBufferGeometry;
