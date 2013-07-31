var STATUS = {
  STALE : 1, //not started and expired
  TODAY_DONE : 2, //today finishd
  TODAY_NOT_DONE : 3, //today not finished, but just today
  BROKEN : 4, //yesterday or days before hasn't done
  DONE : 5, //21 days has been done
  ERROR : 6
};


getHaibtStatus = function(userHabit)
{
	var aday = 1000*60*60*24;
	var daysFromStart = Math.floor((Date.now() - userHabit.startDate.valueOf())/aday);

	if(userHabit.lastUpdateDate == null){
		var daysFromStart = Math.floor((Date.now() - userHabit.startDate.valueOf())/aday);
		if(daysFromStart > 0){
			return {status: STATUS.STALE, lasted:0};
		}
		if(daysFromStart == 0){
			return {status: STATUS.TODAY_NOT_DONE, lasted:0};
		}
	}

	var lasted = Math.floor( (userHabit.lastUpdateDate.valueOf() - userHabit.startDate.valueOf)/aday);

	if(daysFromStart > 21){
		return {status: STATUS.BROKEN, lasted:lasted};
	}

	var daysFromLastupdate = Math.floor((Date.now() - userHabit.lastUpdateDate.valueOf())/aday);
	if(daysFromStart == 21 && daysFromLastupdate == 0){
		return {status: STATUS.DONE, lasted:21};
	}
	if(daysFromLastupdate==0){
		return {status: STATUS.TODAY_DONE, lasted: lasted};
	}
	if(daysFromLastupdate==1){
		return {status: STATUS.TODAY_NOT_DONE, lasted: lasted};
	}
	if(daysFromLastupdate > 1){
		return {status: STATUS.BROKEN, lasted: lasted};
	}

	return {status: STATUS.ERROR, lasted: lasted};


}

module.exports.STATUS = STATUS;
module.exports.getHaibtStatus = getHaibtStatus;