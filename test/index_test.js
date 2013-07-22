var assert = require('assert');

suite("index", function(){
	var target = require('./../routes/index.js');
	test('should redirect to show user page if user logged in', function(){
		var req = {user : {name: test, _id: 123}};

		var res = {
			targeturl : "",
			redirect : function(url){
				this.targeturl = url;
			}
		};
		target.index(req, res);
		assert.equal(res.targeturl, "/user/:123")
	});

	test('should go to index page if user is not logged in', function(){
		var req = {};

		var res = {
			renderView : "",
			render : function(view){
				this.renderView = view;
			}
		};
		target.index(req, res);
		assert.equal(res.renderView, "index")
	});

});