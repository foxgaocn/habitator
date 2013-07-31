var db =require ('./../../lib/db.js');

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
	db.getActiveUserHabit(req.user._id).then(function(userHabit){
		if(userHabit == null){
			res.render('new');
		}else
		{
			console.log('active habit found for user, getting habit information');
			db.findHabitByUserId(userHabit.userId).then(
				function(habit){
					console.log('before rendor habit ' + habit);
					res.render('habit', {model: {userHabit: userHabit, habit:habit}})
				});
			
		}
	})
	.done();
}

