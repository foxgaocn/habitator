var assert = require('assert')
 , target = require('./../lib/helpers.js');

suite("habitStatus", function(){

	var aDay = 1000*3600*24;

	test('should return "stale" if started date is overdue', function(){
		var userHabit = {
			startDate: Date.now() - 2*aDay, 
			lastUpdateDate: null};
		var status = target.getHaibtStatus(userHabit);
		assert.equal(status.status, target.STATUS.STALE);
		assert.equal(status.lasted, 2);
	});

	test('should return "today_not_done" in day 1 without lastUpdateDate', function(){
		var userHabit = {
			startDate: Date.now(), 
			lastUpdateDate: null};
		var status = target.getHaibtStatus(userHabit);
		assert.equal(status.status, target.STATUS.TODAY_NOT_DONE);
		assert.equal(status.lasted, 0);
	});


	test('should return "today_done" in day 1 with lastUpdateDate', function(){
		var userHabit = {
			startDate: Date.now(), 
			lastUpdateDate: Date.now()};
		var status = target.getHaibtStatus(userHabit);
		assert.equal(status.status, target.STATUS.TODAY_DONE);
		assert.equal(status.lasted, 1);
	});

	test('should return "today_not_done" in day 5', function(){
		var userHabit = {
			startDate: Date.now() - 4*aDay, 
			lastUpdateDate: Date.now()-aDay};
		var status = target.getHaibtStatus(userHabit);
		assert.equal(status.status, target.STATUS.TODAY_NOT_DONE);
		assert.equal(status.lasted, 4);
	});


	test('should return "today_done" in day 5', function(){
		var userHabit = {
			startDate: Date.now() - 4*aDay, 
			lastUpdateDate: Date.now()};
		var status = target.getHaibtStatus(userHabit);
		assert.equal(status.status, target.STATUS.TODAY_DONE);
		assert.equal(status.lasted, 5);
	});

	test('should return "broken" in day 5', function(){
		var userHabit = {
			startDate: Date.now() - 4*aDay, 
			lastUpdateDate: Date.now() - 2*aDay};
		var status = target.getHaibtStatus(userHabit);
		assert.equal(status.status, target.STATUS.BROKEN);
		assert.equal(status.lasted, 3);
	});

	test('should return "broken" in day 23', function(){
		var userHabit = {
			startDate: Date.now() - 22*aDay, 
			lastUpdateDate: Date.now() - 4*aDay};
		var status = target.getHaibtStatus(userHabit);
		assert.equal(status.status, target.STATUS.BROKEN);
		assert.equal(status.lasted, 19);
	});

	test('should return "done" in day 23', function(){
		var userHabit = {
			startDate: Date.now() - 22*aDay, 
			lastUpdateDate: Date.now() - 2*aDay};
		var status = target.getHaibtStatus(userHabit);
		assert.equal(status.status, target.STATUS.DONE);
		assert.equal(status.lasted, 21);
	});

	test('should return "done" in day 21', function(){
		var userHabit = {
			startDate: Date.now() - 20*aDay, 
			lastUpdateDate: Date.now()};
		var status = target.getHaibtStatus(userHabit);
		assert.equal(status.status, target.STATUS.DONE);
		assert.equal(status.lasted, 21);
	});


	test('should return "today_not_done" in day 21', function(){
		var userHabit = {
			startDate: Date.now() - 20*aDay, 
			lastUpdateDate: Date.now()-aDay};
			console.log('daysFromLastupdate ='+ Math.floor((Date.now() - userHabit.lastUpdateDate.valueOf())/aDay));
		var status = target.getHaibtStatus(userHabit);
		assert.equal(status.lasted, 20);
		assert.equal(status.status, target.STATUS.TODAY_NOT_DONE);
		
	});

	test('should return "broken" in day 21', function(){
		var userHabit = {
			startDate: Date.now() - 20*aDay, 
			lastUpdateDate: Date.now()-2*aDay};
		var status = target.getHaibtStatus(userHabit);
		assert.equal(status.status, target.STATUS.BROKEN);
		assert.equal(status.lasted, 19);
	});

	test('should return "not ready" in day 1', function(){
		var userHabit = {
			startDate: Date.now() + aDay, 
			lastUpdateDate: null};
		var status = target.getHaibtStatus(userHabit);
		assert.equal(status.status, target.STATUS.NOT_READY);
		assert.equal(status.lasted, -1);
	});

});