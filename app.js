
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
  , config = require('./configure')
  , db = require('./lib/db.js')
  , mongoose = require('mongoose');


everyauth.everymodule.findUserById(function (id, callback) {
    db.findUserById(id)
    .then(function(user){
      callback(null, user);
    } ,function(err){
        console.log('error find user ' + err);
    }).done();
});

var fbFindOrCreateUser = function (session, accessToken, accessTokExtra, fbUserMetadata) {
    var promise = this.Promise();
    db.findOrCreateFbUser(fbUserMetadata, promise);
    return promise;
}

everyauth.facebook
    .appId(config.fb.appId)
    .appSecret(config.fb.appSecret)
    .handleAuthCallbackError(function (req, res) {
        res.send('sorry, in order to use the app, you need to grant facebook access')
    })
    .findOrCreateUser(fbFindOrCreateUser)
    .redirectPath('/');


var app = express();

app.engine('html', require('ejs').renderFile);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs-locals'));
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser(config.cookieSecret));
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

app.use(function (req, res, next) {
    console.log('new request from ' + req.path);
    next();
});

app.get('/', function (req, res, next) {
    require("./routes/index").index(req, res);
});


require('./lib/boot')(app, { verbose: true });

app.use(function (err, req, res, next) {
    console.log('did not find resource');
    if (~err.message.indexOf('not found')) return next();

    console.error(err.stack);

    res.status(500).render('5xx');
});

app.use(function (req, res, next) {
    res.status(404).render('404', { url: req.originalUrl });
});


http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
