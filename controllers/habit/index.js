var db =require ('./../../lib/db.js');

exports.create = function(req, res, next){
	db.createHabit(req.body.goal, req.body.action).
	then(function(habit){
		db.createUserHabit(req.user._id, habit._id,  req.body.startDate, null, true)
		.then(function(user_habit){
			res.send('done');
		})
	}).catch( function(err){
		res.send('error');
	})
	.done();
}

exports.update = function(req, res, next){
	console.log('upating habit lastUpdateDate ');
	console.log('lastUpdateDate ' + req.body.lastUpdateDate);
	db.updateUserHabit(req.user._id, req.body.lastUpdateDate).
	then(function(){
		console.log('update done');
		res.send('done');
	})
	.catch( function(err){
		console.log('update error ' + err);	
		res.send('error');
	})
	.done();
}