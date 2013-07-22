var assert = require('assert')
, Promise = require('./promise.js');

suite("db", function(){
	var target = require('./../lib/db.js');
	
	test('should not find user', function(){
		target.findUserById(12,
			function(){
				assert(false, "but it found a user");
			}
			, function(){
				assert(true, "didn't find the user");
		})
	});

	test('should find user', function(done){
		var promise = new Promise();

		var fbMetadata = {
			id:'123',
			name: 'first last',
			first_name: 'first',
			last_name: 'last',
			email: 'fl@gmail.com',
			username: 'fl',
			gender:'male',
			};

		var ret = target.findOrCreateFbUser(fbMetadata, promise);
		ret.callback(function(val){
			assert.equal(123, val.facebook_id);
			done();
		});
		
		/*.findUserById(123,
			function(){
				assert(true, "should found a user")
			}
			, function(){
				assert(false, "didn't find the user")
		})*/
	});

});