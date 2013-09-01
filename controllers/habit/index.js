var db =require ('./../../lib/db.js');

//AJAX 
exports.create = function(req, res, next){
	//marking existing active habit as inactive
	db.deactivateUserHabit(req.user._id)
	.then(
		db.createHabit(req.body.trigger, req.body.action, req.body.goal)
		.then(function(habit){
			db.createUserHabit(req.user._id, habit._id,  req.body.startDate, null, true)
			.then(function(user_habit){
				res.send('done');
				})
		})
		.catch( function(err){
				res.send('error');
		})
		).done();
}

//AJAX
exports.update = function(req, res, next){
	console.log('upating habit lastUpdateDate ');
	db.updateLastUpdateDate(req.user._id, req.body.lastUpdateDate).
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