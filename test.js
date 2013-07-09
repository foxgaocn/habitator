var obj = {};
obj.test1 = function(){console.log('test1')};
obj['test2'] = function(){console.log('test2')};
obj.test1();
obj['test2']();