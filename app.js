/**
* Module dependencies.
*/

var form = require('connect-form');
var express = require('express'),
    winston = require('winston'),
    routes = require('./routes');
var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {
    layout: false                 
  }); 
  app.use(express.logger());
  app.use(form({ keepExtensions: true }));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.methodOverride());
  app.use(express.compiler({ src: __dirname + '/public', enable: ['less'] }));
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});


// Routes
app.get('/', routes.index);
app.get('/sms',routes.sms);
app.get('/upload', routes.upload);
app.get('/list', routes.list);
app.get('/listxml', routes.listXml);
app.get('/csv', routes.csv);
app.get('/show', routes.show);
app.get('/image', routes.image_put);
app.get('/getdocument',routes.image_get);
app.post('/fupload', routes.file_upload);
app.post('/', routes.index_post);
app.post('/upload_post', routes.upload_post);
app.post('/sms_post',routes.twilioSMS_post);
app.post('/uploadimage', routes.image_upload);
app.post('/postxml', routes.postJson);
app.post('/imagejson', routes.image_postJson);


// Launch server
app.listen(9899); 
