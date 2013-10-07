var STATUS = {
  STALE : 1, //not started and expired
  TODAY_DONE : 2, //today finishd
  TODAY_NOT_DONE : 3, //today not finished, but just today
  BROKEN : 4, //yesterday or days before hasn't done
  DONE : 5, //21 days has been done
  NOT_READY : 6, //not started
  ERROR : 7
};

var nubmersNames = ['first', 'second', 'third', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th', '13th',
'14th', '15th', '16th', '17th', '18th', '19th', '20th', 'last'];

var getHaibtStatus = function(userHabit)
{
	var aday = 1000*60*60*24;
	var offset = userHabit.timeZone*1000*60;

	var daysFromStart = Math.floor((Date.now() - offset - userHabit.startDate.valueOf())/aday);

	if(userHabit.lastUpdateDate == null){
		if(daysFromStart > 0){
			return {status: STATUS.STALE, lasted:daysFromStart, lastedDays:nubmersNames[daysFromStart]};
		}
		if(daysFromStart == 0){
			return {status: STATUS.TODAY_NOT_DONE, lasted:0, lastedDays:nubmersNames[0]};
		}
		if(daysFromStart < 0){
			return {status: STATUS.NOT_READY, lasted:daysFromStart, lastedDays:nubmersNames[daysFromStart]};
		}
	}

	var lasted = Math.floor( (userHabit.lastUpdateDate.valueOf() - offset - userHabit.startDate.valueOf())/aday) + 1;
	var lastedDays = nubmersNames[lasted];
	
	if(daysFromStart >= 20){
		if(lasted == 21) return {status: STATUS.DONE, lasted:lasted, lastedDays:lastedDays};
		if(lasted == 20) return {status: STATUS.TODAY_NOT_DONE, lasted:lasted, lastedDays:lastedDays};
		return {status: STATUS.BROKEN, lasted:lasted, lastedDays:lastedDays};
	}

	var daysFromLastupdate = Math.floor((Date.now() - offset - userHabit.lastUpdateDate.valueOf())/aday);
	if(daysFromLastupdate==0){
		return {status: STATUS.TODAY_DONE, lasted: lasted, lastedDays:lastedDays};
	}
	if(daysFromLastupdate==1){
		return {status: STATUS.TODAY_NOT_DONE, lasted: lasted, lastedDays:lastedDays};
	}
	if(daysFromLastupdate > 1){
		return {status: STATUS.BROKEN, lasted: lasted, lastedDays:lastedDays};
	}

	return {status: STATUS.ERROR, lasted: 0, lastedDays:nubmersNames[0]};
}

var categories = { 1: 'Fitness & Health', 2:'Relationship', 3: 'Happier life', 4: 'Career', 5: 'Study', 6: 'Others'};
module.exports.STATUS = STATUS;
module.exports.getHaibtStatus = getHaibtStatus;
module.exports.categories = categories;