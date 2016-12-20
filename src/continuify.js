'use strict';

/**
 * converts an array of functions into a continuation-passing style
 * @param {Array} funcList
 * @param {Object} data
 * @param {Object|null} context
 * @param {Function|null} onFinishedCallback
 */
const continuify = (funcList = [], data = {}, context = null, onFinishedCallback = null) => {
	let idx = 0;

	if(funcList.length < 1 && onFinishedCallback) {
		onFinishedCallback.call(context, data);
	} else if(funcList.length < 1 && !onFinishedCallback) {
		return null;
	}

	const next = (value) => {
		let layer = funcList[idx++];

		if(!layer && onFinishedCallback) {
			onFinishedCallback.call(context, value);
		} else if(!layer && !onFinishedCallback) {
			return null;
		} else {
			layer.call(context, value, next);
		}
	};

	next.call(context, data);
};

export default continuify;