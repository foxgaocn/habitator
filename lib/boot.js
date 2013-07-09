var fs = require('fs');
var express = require('express');

module.exports = function(parent, option){
	var verbose = option.verbose;
	fs.readdirSync(__dirname + '/../controllers').forEach(function(name){
		/*app = express();
		app.use('/list', function(req, res, next){
			res.send('hello from user');
			});
		parent.use('/user', app);*/
		verbose && console.log('\n   %s', name);
		var obj = require('./../controllers/' + name)
			,name = obj.name || name
			,prefix = obj.prefix || ''
			,app = express()
			,method
			,path;
		if(obj.engine) app.set('view engine', obj.engine);
		app.set('views', __dirname + '/../controllers/' + name + '/views')

		if(obj.before) {
			path = '/' + name + '/:' + name + '_id';
			app.all(path, obj.before);
			verbose && console.log('	ALL %s -> before', path);
			path = '/' + name + '/:' + name + '_id/*';
			app.all(path, obj.before);
			verbose && console.log('	ALL %s -> before', path);
		}

		for (var key in obj){
			if(~['name', 'prefix', 'engine', 'before'].indexOf(key)) continue;
			//route exports
			switch (key) {
				case 'show':
					method = 'get';
					path= '/' + name + '/:' + name + '_id';
					break;
				case 'list':
					method = 'get';
					path = '/' + name + 's';
					break;
				case 'edit':
					method = 'get';
					path = '/' + name + '/:' + name + '_id/edit';
          			break;
		        case 'update':
		          	method = 'put';
		          	path = '/' + name + '/:' + name + '_id';
		          	break;
		        case 'create':
		          	method = 'post';
		          	path = '/' + name;
		          	break;
		        case 'index':
		          	method = 'get';
		          	path = '/';
		          	break;
		        default:
		          	throw new Error('unrecognized route: ' + name + '.' + key);
			}

			path = prefix + path;
			app[method](path, obj[key]);
			verbose && console.log('	%s %s -> %s', method.toUpperCase(), path, key);
		}
		parent.use(app);
	});
};