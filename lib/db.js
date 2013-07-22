
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
	this.findUserById = function(id, callback, errorback){
		UserModel.findById(id, function (err, user) {
			if(err) {return errorback(err);}
        	callback(null, user);
    	});
	};

	this.findOrCreateFbUser = function(fbUserMetadata, promise){
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
	                	console.log('err save users' + err);
	                    promise.fulfill([err])
	                }
	                promise.fulfill(user);
            	});
			}
		});
		return promise;
	};
}



module.exports = exports = new Db();