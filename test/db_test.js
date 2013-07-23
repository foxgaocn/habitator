var assert = require('assert')
, Promise = require('./promise.js');

suite("db", function(){
	var target = require('./../lib/db.js');

	setup(function(done){
		target.dropCollection('usermodels', function(){
			done();
		});
	});
	
	test('should not find user if not exists', function(){
		target.findUserById(12,
			function(){
				assert(false, "but it found a user");
			}
			, function(){
				assert(true, "didn't find the user");
		})
	});

	test('should create user', function(done){
		var fbMetadata = {
			id:'123',
			name: 'first last',
			first_name: 'first',
			last_name: 'last',
			email: 'fl@gmail.com',
			username: 'fl',
			gender:'male',
		};

		target.createUser(fbMetadata, function(user){
			assert.equal(user.name, 'first last');
			done();
		})
	});


	test('should find user if exists', function(done){
		var fbMetadata = {
			id:'1235',
			name: 'tom kate',
			first_name: 'first',
			last_name: 'last',
			email: 'fl@gmail.com',
			username: 'fl',
			gender:'male',
		};

		target.createUser(fbMetadata, function(user){
			target.findUserById(user._id, function(err, foundUser){
				assert.equal(foundUser.name, 'tom kate');
				done();
			});
		})
	});
});