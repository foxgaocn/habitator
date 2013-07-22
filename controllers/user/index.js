exports.before = function(req, res, next){
	console.log('user before action');
	if(req.user == undefined){
		res.redirect("/");
		return;
	}	
	next();
}

exports.list = function(req, res, next){
	res.render('list', { users: db.users});
}

exports.show = function(req, res, next){
	console.log('user show');
	res.render('show', {user : req.user});
}