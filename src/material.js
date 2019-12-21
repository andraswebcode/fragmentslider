import {ShaderMaterial} from '../node_modules/three/src/materials/ShaderMaterial.js';
import {DoubleSide} from '../node_modules/three/src/constants.js';
import {Matrix3} from '../node_modules/three/src/math/Matrix3.js';

import FragmentSliderTexture from './texture.js';
import FragmentSliderShaderMotionBuilder from './motion-builder.js';

function FragmentSliderMaterial() {

	var parameters = {

		side:DoubleSide,

		defines:{
			USE_MAP:true,
			USE_UV:true
		},

		uniforms:{
			map:{
				value:new FragmentSliderTexture()
			},
			uvTransform:{
				value:new Matrix3()
			},
			time:{
				value:0.0
			},
			startPosition:{
				value:0
			},
			endPosition:{
				value:0
			},
			delay:{
				value:0
			},
			spinning:{
				value:0
			},
			easing:{
				value:0
			},
			increase:{
				value:false
			},
			bezier0:{
				value:0
			},
			bezier1:{
				value:0
			}
		},

		vertexShader:this.buildVertexShader(),
		fragmentShader:this.buildFragmentShader()

	};

	ShaderMaterial.call(this, parameters);

	this.type = 'FragmentSliderMaterial';

	var scope = this;

	function updateUvTransform() {
		scope.uniforms.uvTransform.value.copy(scope.uniforms.map.value.matrix);
	}

	this.uniforms.map.value.addEventListener('updateUvTransform', updateUvTransform);

}

FragmentSliderMaterial.prototype = Object.assign(Object.create(ShaderMaterial.prototype), {

	constructor:FragmentSliderMaterial,

	buildVertexShader:function() {

		var motions = new FragmentSliderShaderMotionBuilder();

		return `
			#include <common>
			uniform float time;
			uniform int startPosition;
			uniform int endPosition;
			uniform int delay;
			uniform int spinning;
			uniform int easing;
			uniform bool increase;
			uniform int bezier0;
			uniform int bezier1;
			attribute vec3 restore;
			attribute vec4 random;
			#include <uv_pars_vertex>

			vec3 rotateVector(vec4 q, vec3 v){
				return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
			}

			vec4 quatFromAxisAngle(vec3 axis, float angle){
				float halfAngle = angle * 0.5;
				return vec4(axis.xyz * sin(halfAngle), cos(halfAngle));
			}

			vec3 quadraticBezier(vec3 p0, vec3 c0, vec3 p1, float t){
				float tn = 1.0 - t;
				return tn * tn * p0 + 2.0 * tn * t * c0 + t * t * p1;
			}

			vec3 cubicBezier(vec3 p0, vec3 c0, vec3 c1, vec3 p1, float t){
				float tn = 1.0 - t;
				return tn * tn * tn * p0 + 3.0 * tn * tn * t * c0 + 3.0 * tn * t * t * c1 + t * t * t * p1;
			}

			float progress(float d){
				float p;
				if (delay == 0){
					p = clamp(time, 0.0, 1.0);
				} else {
					p = clamp(time - (d * 0.5), 0.0, 0.5) / 0.5;
				}
				return p;
			}

			${motions.compile()}

			float increaseAnimation(float p){
				float a;
				if (increase){
					a = p;
				} else {
					a = 1.0 - p;
				}
				return a;
			}

			void applyTransform(inout vec3 v){
				float d = delayAnimation(delay);
				float p = progress(d);
				if (spinning != 0){
					vec4 s = spinningAnimation(spinning);
					s = quatFromAxisAngle(normalize(s.xyz), s.w * p);
					v = rotateVector(s, v);
				}
				v *= increaseAnimation(p);
				if (bezier0 != 0 && bezier1 == 0){
					v += quadraticBezier(positionAnimation(startPosition), positionAnimation(bezier0), positionAnimation(endPosition), p);
				} else if (bezier0 == 0 && bezier1 != 0){
					v += quadraticBezier(positionAnimation(startPosition), positionAnimation(bezier1), positionAnimation(endPosition), p);
				} else if (bezier0 != 0 && bezier1 != 0){
					v += cubicBezier(positionAnimation(startPosition), positionAnimation(bezier0), positionAnimation(bezier1), positionAnimation(endPosition), p);
				} else {
					v += mix(positionAnimation(startPosition), positionAnimation(endPosition), p);
				}
			}

			void main(){
				#include <uv_vertex>
				#include <begin_vertex>
				applyTransform(transformed);
				#include <project_vertex>
			}
		`;

	},

	buildFragmentShader:function() {

		return `
			#include <uv_pars_fragment>
			#include <map_pars_fragment>
			void main(){
				vec4 diffuseColor = vec4(1.0);
				#include <map_fragment>
				gl_FragColor = diffuseColor;
			}
		`;

	}

});

export default FragmentSliderMaterial;
