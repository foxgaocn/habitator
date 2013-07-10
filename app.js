
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , everyauth = require('everyauth')
  , fs = require('fs')
  , mongoose = require('mongoose');


mongoose.connect('mongodb://127.0.0.1/habitor');
var models_path = "./models";
fs.readdirSync(models_path).forEach(function (file) {
    require(models_path+'/'+file)
});
var UserModel = mongoose.model('UserModel');

everyauth.everymodule.findUserById(function(userId, callback){
  UserModel.findOne({facebook_id: userId}, function(err, user){
    callback(user, err);
  });
});

everyauth.helpExpress(app)

everyauth.facebook
  .appId('144772812392904')
  .appSecret('90c2e3d9829758a8c6bbc6b0990146fe')
  .handleAuthCallbackError( function (req, res) {
      res.send('sorry, in order to use the app, you need to grant facebook access')
  })
  .findOrCreateUser( function (session, accessToken, accessTokExtra, fbUserMetadata) {
        var promise = this.Promise();
        UserModel.findOne({facebook_id: fbUserMetadata.id},function(err, user) {
        if (err) {
            console.log("error in finding user");
            return promise.fulfill([err]);
        }
        if(user) {
           promise.fulfill(user);
        }else{
            // create new user
            var User = new UserModel({
                name: fbUserMetadata.name,
                firstname: fbUserMetadata.first_name,
                lastname: fbUserMetadata.last_name,
                email: fbUserMetadata.email,
                username: fbUserMetadata.username,
                gender: fbUserMetadata.gender,
                facebook_id: fbUserMetadata.id,
                facebook: fbUserMetadata
                });

            User.save(function(err,user) {
                if(err){
                    console.log("error in saving user");
                    return promise.fulfill([err])
                }
            promise.fulfill(user);
          });
      }
    });
    return promise;
})
.redirectPath('/');


var app = express();

app.engine('html', require('ejs').renderFile);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser('342kfsdakj'));
app.use(express.session())
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(everyauth.middleware(app));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));



// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.use(function(req, res, next){
    console.log('new request from ' + req.path);
    next();
});

app.use('/',function(req, res, next){
    res.render('index');
});


require('./lib/boot')(app, {verbose: true});

app.use(function(err, req, res, next){
  console.log('did not find resource');
	if(~err.message.indexOf('not found')) return next();

	console.error(err.stack);

	res.status(500).render('5xx');
});

app.use(function(req, res, next){
  res.status(404).render('404', { url: req.originalUrl });
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
