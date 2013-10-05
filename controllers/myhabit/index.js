var db =require ('./../../lib/db.js')
 ,helper = require('./../../lib/helpers.js');

exports.before = function(req, res, next){
	if(req.user == undefined){
		res.redirect("/");
		return;
	}	
	next();
}


exports.index = function(req, res, next){
	db.getActiveUserHabit(req.user._id).then(function(userHabit){
		if(userHabit == null){
			res.render('new', {categories :helper.categories, showWarning:false});
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
	canStartNewHabit(req.user._id, function(canNew){
		res.render('new',{habit:{goal:'', action:'', trigger:''}, categories: helper.categories, showWarning: !canNew});
	});
}

exports.retry = function(req, res, next){
	canStartNewHabit(req.user._id, function(canNew){
		db.findHabitByUserId(req.user._id).then(
					function(habit){
						res.render('try', {habit:habit, showWarning: !canNew});
					})
		.done();
	});
}

exports.try = function(req, res, next){
	canStartNewHabit(req.user._id, function(canNew){
		db.findHabitById(req.query.id).then(
				function(habit){
					res.render('try', {habit:habit, showWarning: !canNew});
				})
		.done()
	});
}

var canStartNewHabit = function(userid, callback){
	db.getActiveUserHabit(userid).then(function(userHabit){
		if(userHabit == null){
			callback(true);
		}else{
			var status = helper.getHaibtStatus(userHabit);
			console.log('current habit status ' + getViewName(status.status));
			if(status.status == helper.STATUS.TODAY_DONE || status.status == helper.STATUS.TODAY_NOT_DONE){
				callback(false);
			}else
			{
				callback(true);
			}
		}
	}).done();
}

var canTryHabit = function(habit){
	var status = helper.getHaibtStatus(userHabit);
	return (status == helper.STATUS.TODAY_DONE || status == helper.STATUS.TODAY_NOT_DONE);
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