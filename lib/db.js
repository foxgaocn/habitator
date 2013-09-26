
var models = require("./../models/models.js")
, mongoose = require('mongoose')
, config = require("./../configure.js")
, Q = require('q');
//this will be loaded once even if required multiple times
console.log('connecting to ' + config.database + '.............');
mongoose.connect(config.database);

var UserModel = models.userModel
, HabitModel = models.habitModel
, UserHabitModel = models.userHabitModel;

function Db(){

    Db.prototype.findUserByName = function(name){
        var deferred = Q.defer();
        UserModel.findOne({name : name}, deferred.makeNodeResolver());
        return deferred.promise;
    }

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
		HabitModel.findOne({_id : habit_id}, deferred.makeNodeResolver());
		return deferred.promise;
	};

	Db.prototype.createUserHabit = function(user_id, habit_id, start_date, lastupdate_date, time_zone, is_Active){
		var deferred = Q.defer();
		var userHabit = new UserHabitModel({
            userId: user_id,
            habitId: habit_id,
            startDate: start_date,
            lastUpdateDate: lastupdate_date,
            timeZone: time_zone,
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

    Db.prototype.updateLastUpdateDate= function(user_id, lastupdate_date, time_zone)
    {
        var deferred = Q.defer();
        //looks like only yyyy-mm-dd format will work
        var formattedDate = new Date()

        var condition = {userId : user_id, isActive:true}
          , options = { multi: true }
          , update = { lastUpdateDate: lastupdate_date, timeZone:time_zone };

        UserHabitModel.update(condition, update, options, function(err, numAffected){
            if(err || numAffected != 1) deferred.reject(new Error('error in update user habit'));
            else deferred.resolve(numAffected);
        });

        return deferred.promise;
    }

    Db.prototype.deactivateUserHabit = function(user_id)
    {
        var deferred = Q.defer();
        var condition = {userId : user_id, isActive:true}
          , options = { multi: true }
          , update = { isActive: false };

        UserHabitModel.update(condition, update, options, function(err, numAffected){
            if(err) deferred.reject(new Error('error in deactivate user habit'));
            else deferred.resolve(numAffected);
        });

        return deferred.promise;
    }

    Db.prototype.createHabit = function(trigger, action, goal, category, comment){
    	var deferred = Q.defer();
    	var habit = new HabitModel({
    		goal: goal,
    		action: action,
            trigger: trigger,
            category: category,
            comment: comment
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

    Db.prototype.findAllHabits = function(){
        var deferred = Q.defer();
        var query = HabitModel.find();
        return query.exec();
    }

    Db.prototype.findHabitById = function(id){
        console.log('find habit by id: ' + id);
        var deferred = Q.defer();
        HabitModel.findById(id, deferred.makeNodeResolver());
        return deferred.promise;
    };
}

module.exports = new Db();