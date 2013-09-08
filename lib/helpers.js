var STATUS = {
  STALE : 1, //not started and expired
  TODAY_DONE : 2, //today finishd
  TODAY_NOT_DONE : 3, //today not finished, but just today
  BROKEN : 4, //yesterday or days before hasn't done
  DONE : 5, //21 days has been done
  NOT_READY : 6, //not started
  ERROR : 7
};


getHaibtStatus = function(userHabit)
{
	var aday = 1000*60*60*24;
	var offset = userHabit.timeZone*1000*60;

	var daysFromStart = Math.floor((Date.now() - offset - userHabit.startDate.valueOf())/aday);

	if(userHabit.lastUpdateDate == null){
		if(daysFromStart > 0){
			return {status: STATUS.STALE, lasted:daysFromStart};
		}
		if(daysFromStart == 0){
			return {status: STATUS.TODAY_NOT_DONE, lasted:0};
		}
		if(daysFromStart < 0){
			return {status: STATUS.NOT_READY, lasted:daysFromStart};
		}
	}

	var lasted = Math.floor( (userHabit.lastUpdateDate.valueOf() - offset - userHabit.startDate.valueOf())/aday) + 1;
	
	if(daysFromStart >= 20){
		if(lasted == 21) return {status: STATUS.DONE, lasted:lasted};
		if(lasted == 20) return {status: STATUS.TODAY_NOT_DONE, lasted:lasted};
		return {status: STATUS.BROKEN, lasted:lasted}
	}

	var daysFromLastupdate = Math.floor((Date.now() - offset - userHabit.lastUpdateDate.valueOf())/aday);
	if(daysFromLastupdate==0){
		return {status: STATUS.TODAY_DONE, lasted: lasted};
	}
	if(daysFromLastupdate==1){
		return {status: STATUS.TODAY_NOT_DONE, lasted: lasted};
	}
	if(daysFromLastupdate > 1){
		return {status: STATUS.BROKEN, lasted: lasted};
	}

	return {status: STATUS.ERROR, lasted: 0};


}

module.exports.STATUS = STATUS;
module.exports.getHaibtStatus = getHaibtStatus;