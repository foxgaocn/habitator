
console.log("loaded db module")
var mongoose = require('mongoose')
, fs = require('fs')
, config = require("./../configure.js");

mongoose.connect(config.database);

var models_path = __dirname + "./../models";
fs.readdirSync(models_path).forEach(function (file) {
	require(models_path + '/' + file)
});

var UserModel = mongoose.model('UserModel');

function Db(){
	Db.prototype.findUserById = function(id, callback, errorback){
		UserModel.findById(id, function (err, user) {
			if(err) {return errorback(err);}
        	callback(null, user);
    	});
	};

	Db.prototype.createUser = function(fbUserMetadata, callback, errorback){
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
            	errorback(err);
            } else {
            	callback(user);
        	}
    	});
	};

	Db.prototype.findOrCreateFbUser = function(fbUserMetadata, promise){
		UserModel.findOne({ facebook_id: fbUserMetadata.id },  function (err, user){
			if(err){
				console.log('err find users' + err);
				promise.fulfill([err]);
			} 
			else if(user){
				console.log('found user' + user);
				promise.fulfill(user);
			}
			else
			{
				console.log('create user');
				this.createUser(fbUserMetadata, 
					function(user){	promise.fulfill(user);}, 
					function(err){promise.fulfill([err])});
			}
		});
		return promise;
	};

	Db.prototype.dropCollection = function(name, fn){
		mongoose.connection.db.dropCollection(name, function(err, result){
			fn(result);
		});
	};
}

module.exports = new Db();