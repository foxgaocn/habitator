
exports.signout = function(req, res, next){
	req.logout();
	res.redirect("/");
	return;
}
