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

UserModel = mongoose.model('UserModel', UserSchema);