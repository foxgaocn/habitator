var assert = require('assert')
, Promise = require('./promise.js')
, mongoose = require('mongoose')
, Q = require('Q');

suite("db", function(){
	var target = require('./../lib/db.js');
	var target2 = require('./../lib/db.js');
	setup(function(done){
		target.dropCollection('usermodels', function(){});
		target.dropCollection('userhabitmodels', function(){});
		target.dropCollection('habitmodels', function(){});
		done();
	});
	
	test('should not find user if not exists', function(done){
		target.findUserById(mongoose.Types.ObjectId('4edd40c86762e0fb12000003'))
		.then(function(obj){
			assert.equal(null, obj, "but it found a user");
			done();
		}).done();
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

		target.createUser(fbMetadata)
		.then(function(user){
			target.findUserById(user._id)
			.then(function(user){
				assert.equal(user.name, 'tom kate');
				done();
			});
		}).catch(function(err){
			assert(false, err);
		})
		.done();
	});

	test('should create habit', function(done){
		target.createHabit("i want to be fit", "i will run 3 kms everyday")
		.then(function(habit){
			assert.notEqual(null, habit, 'habit should not be null');
			done();
		})
		.catch(function(err){
			assert(false, 'error occurred' + err);
		}).done();
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

		target.createUser(fbMetadata)
		.then(function(user){
			assert.equal(user.name, 'first last');
			done();
		}).done();
	});


	

	test('should not find user habit if not exists', function(done){
		var promise = target.getActiveUserHabit(12);

		promise.then(function(userHabit){
			if(userHabit != null){
				assert(false, "Found something");
			}else{
				assert(true, "didnot find user");
			}
			done();
		}, function(err){
			assert(false, "db error " + err);
			done();
		}).done();

	});


	test('should find user habit if exists', function(done){
		target.createUserHabit(32, 22, null, null, 12, true)
		.then( function(userHabit){
			return target.getActiveUserHabit(userHabit.userId);
		}).then(function(habit){
			assert.notEqual(undefined, habit);
			done();
		}).catch(function(error){
			assert(false, "error occurred " + error);
			done();
		}).done();		
	});

	

	test('should get habit by user id if exists', function(done){
		target.createHabit("to be fit", "i will run 3 kms everyday")
		.then(function(habit){
			return target.createUserHabit(1, habit._id, null, null, 0, true)
		})
		.then(function(userHabit){
			return target.findHabitByUserId(1);
		})
		.then(function(habit){
			assert.equal('to be fit', habit.goal);
			done();
		})
		.catch(function(err){
			assert(false, 'error occurred' + err);
		}).done();
	});

});