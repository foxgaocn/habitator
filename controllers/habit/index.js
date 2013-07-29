var db =require ('./../../lib/db.js');

exports.create = function(req, res, next){
	db.createHabit(req.body.goal, req.body.action).
	then(function(habit){
		console.log('user habit created ' + habit);
		db.createUserHabit(req.user._id, habit._id, new Date(), null, 0, true)
		.then(function(user_habit){
			res.send('done');
		})
	}).catch( function(err){
		res.send('error');
	})
	.done();
}