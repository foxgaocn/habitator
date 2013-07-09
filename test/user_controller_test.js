var assert = require('assert');

suite('userController', function(){
	var uc = require('./../controllers/user/index.js');
	test('user list should get all users', function(){
		var mockRes = {}
		mockRes.render = function(list, obj){ return 'list';}
		var act = uc.list(null, mockRes, null);
		assert.equal('list', act)
	});
});