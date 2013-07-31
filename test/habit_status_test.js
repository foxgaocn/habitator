var assert = require('assert')
 , target = require('./../lib/helpers.js');

suite("habitStatus", function(){

	test('should return "stale" if started date is overdue', function(done){
		var userHabit = {
			startDate: new date( Date.now() - 1000 * 3600 *48), 
			lastUpdateDate: null};
		var status = target.getHaibtStatus(userHabit);
		assert.equal(target.STATUS.STALE, status);
	});

});