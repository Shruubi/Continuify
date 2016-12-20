import expect from 'expect.js';
import continuify from './../src/continuify';

describe('sanity check', function () {
	it('should verify that true is true', function () {
		expect(true).to.be.eql(true);
	});

	it('should verify that true is not false', function () {
		expect(true).to.not.be.eql(false);
	});
});

describe('continuify()', function () {
	it('should be called for each function in the list', function () {
		let testFuncArray = [
			(data, next) => { data.val += 1; next(data); },
			(data, next) => { data.val += 2; next(data); },
			(data, next) => { data.val += 3; next(data); }
		];

		continuify(testFuncArray, { val: 0 }, null, function (data) {
			expect(data.val).to.be.eql(6);
		});
	});

	it('should have the appropriate this-context set', function () {
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
			expect(data.val).to.be.ok();
		});
	});
});