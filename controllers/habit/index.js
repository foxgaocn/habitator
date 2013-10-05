var db =require ('./../../lib/db.js');
var helpers = require('./../../lib/helpers.js')

//AJAX 
exports.create = function(req, res, next){
	//marking existing active habit as inactive
	db.deactivateUserHabit(req.user._id)
	.then(
		db.createHabit(req.body.trigger, req.body.action, req.body.goal, req.body.category, req.body.comment)
		.then(function(habit){
			db.createUserHabit(req.user._id, habit._id,  req.body.startDate, null, req.body.timeZone, true)
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
	db.updateLastUpdateDate(req.user._id, req.body.lastUpdateDate, req.body.timeZone).
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

exports.lists = function(req, res, next){
	db.findAllHabits()
	.then(function(docs){
		var group = {};
		docs.map(function (doc) {
			if(!(doc.category in group)){
				group[doc.category]= []; 
			}
			group[doc.category].push(doc);
		});
		if(group[6]!=undefined && group[undefined] != undefined){
			group[6] = group[6].concat(group[undefined]);
			delete group[undefined];
		}
		res.render('lists', {known: req.user == undefined, habits: group, categories: helpers.categories});
	})
	.end();//mongoos promise. use end instead of done
}