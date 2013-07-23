var obj = {
	id : 1,
	func : function(){
		console.log(this.id);
	}
};

id3 = 3;
function f1(){
	var id2 = 2;
	id3 = 4;
	return function(){
		console.log(this);
		console.log(id2);
		console.log(id3);
	}
}
console.log(id3);


//obj.func();
f1()();