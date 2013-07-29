
var models = require("./../models/models.js")
, mongoose = require('mongoose')
, config = require("./../configure.js")
, Q = require('Q');
//this will be loaded once even if required multiple times
console.log('connecting to ' + config.database + '.............');
mongoose.connect(config.database);

var UserModel = models.userModel
, HabitModel = models.habitModel
, UserHabitModel = models.userHabitModel;

function Db(){
	Db.prototype.findUserById = function(id){
		var deferred = Q.defer();
		UserModel.findById(id, deferred.makeNodeResolver());
		return deferred.promise;
	};

	Db.prototype.createUser = function(fbUserMetadata){
		var deferred = Q.defer();
		var User = new UserModel({
            name: fbUserMetadata.name,
            firstname: fbUserMetadata.first_name,
            lastname: fbUserMetadata.last_name,
            email: fbUserMetadata.email,
            username: fbUserMetadata.username,
            gender: fbUserMetadata.gender,
            facebook_id: fbUserMetadata.id,
            facebook: fbUserMetadata
    	});

    	User.save(function (err, user) {
            if (err) {
            	deferred.reject(new Error(error));
            } else {
            	deferred.resolve(user);
        	}
    	});
    	return deferred.promise;
	};

	Db.prototype.findOrCreateFbUser = function(fbUserMetadata, promise){
		UserModel.findOne({ facebook_id: fbUserMetadata.id },  function (err, user){
			if(err){
				console.log('err find users' + err);
				promise.fulfill([err]);
			} 
			else if(user){
				//console.log('found user' + user);
				promise.fulfill(user);
			}
			else
			{
				console.log('create user');
				Db.prototype.createUser(fbUserMetadata)
				.then(function(user){	promise.fulfill(user);}, 
						function(err){promise.fulfill([err])}
				);
			}
		});
		return promise;
	};

	Db.prototype.getActiveUserHabit = function(user_id){
		var deferred = Q.defer();
		UserHabitModel.findOne({userId : user_id, isActive : true}, deferred.makeNodeResolver());
		return deferred.promise;
	};

	Db.prototype.getHabit = function(habit_id){
		var deferred = Q.defer();
		console.log('getting habit with id ' + habit_id);
		HabitModel.findOne({_id : habit_id}, deferred.makeNodeResolver());
		return deferred.promise;
	};

	Db.prototype.createUserHabit = function(user_id, habit_id, start_date, lastupdate_date, lasted_Days, is_Active){
		var deferred = Q.defer();
		var userHabit = new UserHabitModel({
            userId: user_id,
            habitId: habit_id,
            startDate: start_date,
            lastUpdateDate: lastupdate_date,
            lastedDays: lasted_Days,
            isActive: is_Active,
    	});

    	userHabit.save(function (err, obj) {
            if (err) {
            	deferred.reject(new Error(error));
            } else {
            	deferred.resolve(obj);
        	}
    	});
    	return deferred.promise;
    };

    Db.prototype.createHabit = function(goal, action){
    	var deferred = Q.defer();
    	var habit = new HabitModel({
    		goal: goal,
    		action: action
    	});

    	habit.save(function (err, obj) {
            if (err) {
            	deferred.reject(new Error(error));
            } else {
            	deferred.resolve(obj);
        	}
    	});
    	return deferred.promise;
    };

    Db.prototype.findHabitByUserId = function(user_id){
    	//var deferred = Q.defer();

    	return Db.prototype.getActiveUserHabit(user_id)
    	.then(function(userHabit){
    		return Db.prototype.getHabit(userHabit.habitId);
    	});
    	//return deferred.promise;
    };

	Db.prototype.dropCollection = function(name, fn){
		mongoose.connection.db.dropCollection(name, function(err, result){
			fn(result);
		});
	};
}

module.exports = new Db();