
exports.theory = function(req, res, next){
	res.render('theory', {known: req.user == undefined});
}

exports.contact = function(req, res, next){
	res.render('contact', {known: req.user == undefined});
}

exports.about = function(req, res, next){
	res.render('about', {known: req.user == undefined});
}