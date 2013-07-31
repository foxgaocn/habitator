var db =require ('./../../lib/db.js')
 ,helper = require('./../../lib/helpers.js');

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
			db.findHabitByUserId(userHabit.userId).then(
				function(habit){
					var status = helper.getHaibtStatus(userHabit);
					var viewModel = {model: {habit:habit, lasted:status.lasted} };
					var viewName = getViewName(status.status);
					res.render(viewName, {model: {userHabit: userHabit, habit:habit}})
				});
			
		}
	})
	.done();
}

getViewName = function(status){
	switch(status){
		case helper.STATUS.STALE:
		  return 'stale';
		case helper.STATUS.DONE:
		  return 'done';
		case helper.STATUS.TODAY_DONE:
		  return 'ontrack';
		case helper.STATUS.TODAY_NOT_DONE:
		  return 'progress';
		case helper.STATUS.BROKEN:
		  return 'broken';
		default:
		  return 'error';
	}
}