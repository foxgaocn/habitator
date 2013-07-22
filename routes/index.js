exports.index = function(req, res){
	if(req.user != undefined){
        res.redirect("/user/:" + req.user._id)
    }else{
  		res.render('index')
	};
};