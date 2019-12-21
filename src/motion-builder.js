function FragmentSliderShaderMotionBuilder() {}

Object.assign(FragmentSliderShaderMotionBuilder.prototype, {

	constructor:FragmentSliderShaderMotionBuilder,

	items:{
		position:{},
		delay:{},
		spinning:{},
		easing:{}
	},

	indexes:{
		position:2,
		delay:2,
		spinning:2,
		easing:2
	},

	_getCompiledItems:function(type) {

		var items = this.items[type];
		var code = '';

		for (name in items){
			code += `else if (type == ${items[name].index}){
					${items[name].code}
				} `;
		}

		return code;

	},

	compile:function() {

		var position = this._getCompiledItems('position');
		var delay = this._getCompiledItems('delay');
		var spinning = this._getCompiledItems('spinning');
		var easing = this._getCompiledItems('easing');

		return `vec3 positionAnimation(int type){
				vec3 a;
				if (type == 1){
					a = random.xyz;
				} ${position}else {
					a = restore.xyz;
				}
				return a;
			}

			float delayAnimation(int type){
				float a;
				if (type == 1){
					a = random.w;
				} ${delay}else {
					a = 0.0;
				}
				return a;
			}

			vec4 spinningAnimation(int type){
				vec4 a;
				if (type == 1){
					a = vec4(random.xyz, floor(random.w * 3.0 + 1.0) * PI2);
				} ${spinning}else {
					a = vec4(0.0, 1.0, 0.0, 0.0);
				}
				return a;
			}

			float easingAnimation(int type, float p){
				float a;
				if (type == 1){
					a = random.w * p;
				} ${easing}else {
					a = p;
				}
				return a;
			}`;

	}

});

FragmentSliderShaderMotionBuilder.register = function(type, items) {

	for (name in items){
		this.prototype.items[type][name] = {
			code:items[name],
			index:this.prototype.indexes[type]++
		};
	}

};

FragmentSliderShaderMotionBuilder.getIndexByName = function(type, name) {

	var index = this.prototype.items[type][name];

	if (!index && name !== 'random') return 0;
	else if (name === 'random') return 1;
	else return index.index;

};

export default FragmentSliderShaderMotionBuilder;
