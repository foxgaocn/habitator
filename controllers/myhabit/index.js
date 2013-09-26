var db =require ('./../../lib/db.js')
 ,helper = require('./../../lib/helpers.js');

exports.before = function(req, res, next){
	if(req.user == undefined){
		res.redirect("/");
		return;
	}	
	next();
}

exports.list = function(req, res, next){
	res.render('new', { users: db.users});
}

exports.index = function(req, res, next){
	db.getActiveUserHabit(req.user._id).then(function(userHabit){
		if(userHabit == null){
			res.render('new', {habit:{goal:'', action:'', trigger:''}});
		}else
		{
			db.findHabitByUserId(userHabit.userId).then(
				function(habit){
					var status = helper.getHaibtStatus(userHabit);
					var viewModel = {habit:habit, status:status, startDate:userHabit.startDate, 
						startDateStr:userHabit.startDate.toLocaleString().split(' ').splice(1,3).join(' ')};
					var viewName = getViewName(status.status);
					res.render(viewName, viewModel);
				});
			
		}
	})
	.done();
}

exports.new = function(req, res, next){
	res.render('new',{habit:{goal:'', action:'', trigger:''}});
}

exports.retry = function(req, res, next){
	db.findHabitByUserId(req.user._id).then(
				function(habit){
					console.log("retry habit with goal :" + habit.goal);
					res.render('new', {habit:habit});
				})
	.done();
}

exports.try = function(req, res, next){
	console.log(req.query.id);
	db.findHabitById(req.query.id).then(
				function(habit){
					console.log("retry habit with goal :" + habit.goal);
					res.render('try', {habit:habit});
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
		case helper.STATUS.NOT_READY:
		  return 'tobestarted'
		default:
		  return 'error';
	}
}