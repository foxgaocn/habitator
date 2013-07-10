var db = require('../../db')

exports.before = function(req, res, next){
	console.log('before actions in user')
	var id = req.params.user_id;
	if(!id)	return next();
}

exports.list = function(req, res, next){
	console.log('list users');
	res.render('list', { users: db.users});
}