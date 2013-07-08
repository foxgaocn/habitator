var db = require('../../db')

exports.before = function(req, res, next){
	var id = req.params.user_id;
	if(!id)	return next();
}

exports.list = function(req, res, next){
	res.render('list', { users: db.users});
};