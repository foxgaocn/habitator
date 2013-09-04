/* useage:
 node tool.js startdate lastupdatedate
 */

var db = require('./lib/db.js')
, models = require('./models/models.js');

var UserHabitModel = models.userHabitModel;

var startDate = process.argv[2] ? new Date(process.argv[2]) : Date.now();
var lastUpdateDate = process.argv[3] || null;

db.findUserByName("Harry Gao")
.then(function(user){
	console.log('user is ' + user);
	var condition = {userId : user._id, isActive:true};
	var update = { startDate:startDate, lastUpdateDate: lastUpdateDate };

	UserHabitModel.update(condition, update, null, function(err, numAffected){
		if(err) console.log(err);
		else console.log(numAffected + " documents have been changed");
	})

}).done();

