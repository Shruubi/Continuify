# Continuify

Convert a list of functions into continuation-passing style.

### Installation

```
npm install --save continuify
```

### Usage

Continuify can be imported into your project like so:

```
// ES6 modules
import continuify from 'continuify';

// node modules
var continuify = require('continuify');
```

Continuify defines a single function `continuify()` which can be used like so:
 
```
import continuify from 'continuify';

// our defined list of functions
let testFuncArray = [
	(data, next) => { data.val += 1; next(data); },
	(data, next) => { data.val += 2; next(data); },
	(data, next) => { data.val += 3; next(data); }
];

// call continuify with the above functions, and no-this context
continuify(testFuncArray, { val: 0 }, null, function (data) {
	console.log(data.val); // will output 6
});
```

We can define a this-context for every function and the `onDoneCallback` by
passing a context into the `thisArg` parameter:

```
import continuify from 'continuify';

let ctx = {
	ctxKey: 'SOME_KEY'
};

let testFuncArray = [
	function (data, next) {
		let hasCtxKey = (this.ctxKey == "SOME_KEY".trim());
		data.val = data.val && hasCtxKey;
		next(data);
	},
];

continuify(testFuncArray, { val: true }, ctx, function (data) {
	console.log(this.ctxKey); // will output 'SOME_KEY'
	console.log(data.val); // will output true
});
```

### API

##### continuify(funcList[, data[, thisArg, [onDoneCallback]]])

###### funcList (Array)

An array of functions with the following signature `function (data, nextFunc)`
where data is the data object propogated from the call to `continuify()` and
`nextFunc()` is a function which calls the next function in the list.

###### data (Object)

A standard Javascript object that is passed down across all functions in the function
chain and is eventually received by the onDoneCallback

###### thisArg (Object)

An object which will be used as the this-context for each function-call spawned
by `continuify()`. Internally this is done by using the `Function.prototype.call()`
method, which means all the rules surrounding `Function.prototype.call()` and `this`
apply here. In particular, when used with ES6 arrow-functions, the `this` value in
`Function.prototype.call()` is ignored.

###### onDoneCallback (Function)

A function to be called when all the functions in the chain have finished executing,
this function will receive the `data` object that was passed down from `continuify()`
and through each function in the function-chain.

### License

This software is licensed under the MIT license. Refer to `LICENSE` for the full
license text.