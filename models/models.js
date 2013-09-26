var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Schema
 */
var UserSchema = Schema({
    name: String,
    firstname: String,
    lastname: String,
    email: String,
    username: String,
    facebook_id: String,
    facebook: {}
});

var HabitSchema = Schema({
    trigger: String,
	goal: String,
	action: String,
    category: Number,
    comment: String
});

var UserHabitSchema = Schema({
	userId: String,
	habitId: String,
	startDate: Date,
	lastUpdateDate: Date,
    timeZone: Number,
    isActive : Boolean
});



UserModel = mongoose.model('UserModel', UserSchema);
HabitModel = mongoose.model('HabitModel', HabitSchema);
UserHabitModel = mongoose.model('UserHabitModel', UserHabitSchema);

var models = module.exports = exports = {userModel: UserModel, habitModel: HabitModel, userHabitModel:UserHabitModel}