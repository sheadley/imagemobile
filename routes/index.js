/*!
* Demo registration application
* Copyright(c) 2011 Jean-Tiare LE BIGOT <admin@jtlebi.fr>
* MIT Licensed
*/

// loads model file and engine
var mongoose    = require('mongoose'),
    memberModel = require('../models/MemberModel'),
    imageModel = require('../models/ImageModel'),
    accidentModel = require('../models/AccidentModel'),
    qs = require('querystring'),
    util = require('util'),
    fs = require("fs"),
    winston = require('winston');

 
  

// Open DB connection
mongoose.connect('mongodb://sheadley:head7668@staff.mongohq.com:10025/vescue');


// Home page => registration form
exports.index = function(req, res){
    res.render('index.jade', { title: 'My Registration App', messages: [], errors: [] });
};

// Member list page
exports.list = function(req, res){
    winston.info('>>>>list');
    memberModel.find({},function(err, docs){
        res.render('list.jade', { title: 'My Registration App - Member list', members: docs });
    });
};

exports.listXml = function(req, res){
    winston.info('>>>>listXml');
    memberModel.find({},function(err, docs){
        var document = {members: docs};
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(document));
    });
};

exports.postJson = function(req, res){
    winston.info('>>>>postJson');
    winston.info('request body'+req.body); 
    console.log(req.headers); 
    console.log("Body = "+util.inspect(req.body, true, null));
    console.log('Method= '+req.method);
    console.log('Length= '+req.headers['content-length']);
    console.log('Content Type= '+req.headers['content-type']);

     
    res.writeHead(200, {"Content-Type": "text/html"});
    res.end();
};

exports.postit = function(request, response){
  console.log(request.body);      // your JSON
  response.send(request.body);    // echo the result back
};


// SMS page => sms form
exports.sms = function(req, res){
    winston.info('>>>>sms');
    res.render('SMS.jade', { title: 'My SMS App', messages: [], errors: [] });
};

// Upload page => upload form
exports.upload = function(req, res){
    winston.info('>>>>upload');
    res.render('upload.jade', { title: 'My Upload App', messages: [], errors: [] });
};

exports.upload_post = function(req, res){
       winston.info('File = '+req.form);  
       // get the temporary location of the file
        var tmp_path = req.files.thumbnail.path;
        winston.info('FileName = '+tmp_path);  
        console.log(req.body);
        console.log(req.files);
        fs.rename(tmp_path, "/tmp/test.png", function(err) {
            if (err) {
                fs.unlink("/tmp/test.png");
                fs.rename(tmp_path, "/tmp/test.png");
            }
        });
        res.writeHead(200, {"Content-Type": "text/html"});
        res.write("received image:<br/>");
        res.write("<img src='/show' />");
        res.end();
};
       

exports.twilioSMS_post = function(req, res){
    winston.info('from = '+req.body.from);
      var accountSid = 'AC1f2f8d8b201a4836aaeea0c0259af3a1',
	  authToken = '602de2b4a13705ddf7298f32df5c863f',
//    var accountSid = 'AC42403a38772740809ee44e32d8527b4b',
//        authToken = '59ec5593a3c9dc18ead3cc8c8557af72',
        apiVersion = '2010-04-01',
        uri = '/'+apiVersion+'/Accounts/'+accountSid+'/SMS/Messages',
        host = 'api.twilio.com',
        fullURL = 'https://'+accountSid+':'+authToken+'@'+host+uri,
        from = req.body.from,
        to = req.body.to,
        body = req.body.body;
        rest.post(fullURL, {
        data: { From:from, To:to, Body:body }
    }).on('complete', function(data){
        winston.info('complete = '+JSON.stringify(data));
        res.render('SMS.jade', { title: 'My Registration App', messages: data, errors: []});

    }).on('error', function(data) {
          winston.info('Error fetching [' + fullURL + ']. Body:\n' + data);
    });
};
 
// Member list quick-and-dirty(tm) CSV export
exports.csv = function(req, res){
    memberModel.find({},function(err, docs){
        members = new Array();
        str = "";
        docs.forEach(function (member) {
            str += member.title;
            str += "; " + member.firstname;
            str += "; " + member.lastname;
            str += "; " + member.mail;
            str += "; " + member.date;
            str += "\n";
        });
        res.header('Content-type', 'text/csv');
        res.send(str);
    });
};

exports.file_upload = function(req, res) {
    console.log("Form = "+req.form);
    console.log("Form = "+util.inspect(req.form, true, null));
    console.log("Files = "+req.files.thumbnail);
    console.log("Files = "+util.inspect(req.files, true, null));
    console.log("Files Thumbnail = "+util.inspect(req.files.thumbnail, true, null));


    console.log("Body = "+req.body);
    console.log("Body = "+util.inspect(req.body, true, null));
    res.writeHead(200, {"Content-Type": "image/png"});
    res.end();


};

exports.image_upload = function(req, res) {
	db = mongoose.connection.db
	
	winston.info('File = '+req.form);  
       // get the temporary location of the file
        var tmp_path = req.files.thumbnail.path;
	winston.info('File Path = '+tmp_path);
	winston.info('Email = '+req.body.email);

	// Our file ID
	var fileId = new mongoose.mongo.ObjectID();
	console.log('fileId = '+fileId);


	var collection = new mongoose.mongo.Collection(db, 'members');
	collection.insert({pictureid: fileId, title: req.body.title, firstname: req.body.firstname, lastname : req.body.lastname, email : req.body.email}, function(err, doc) {
		if (!err) {
			console.log('Insert Success');
		}
		else {
			console.log('Error1 = '+err);
		}
	});


	fs.rename(tmp_path, "/tmp/test.jpg", function(err) {
            if (err) {
                fs.unlink("/tmp/test.jpg");
                fs.rename(tmp_path, "/tmp/test.jpg");
            }
        });

	
		
	var gs = new mongoose.mongo.GridStore(db, fileId, 'w', {
         		'content_type': 'image/png',
         		'metadata':{
          		'author': 'Steven'
         	},
         	'chunk_size': 1024*4
	});

	// Open the new file
   	gs.open(function(err, gridStore) {
            if(!err) {
		console.log('GS Open Success');
      		gridStore.writeFile('/tmp/test.jpg', function(err, doc) {
      			if(!err) {
             			console.log('Success!!!'+doc.uploadDate);
      			}
      			else {
   				console.log('Error1 = '+err);
      			}
      		});
	    }
     	    else {
		console.log('Error2 = '+err);
	    }
        });
 	console.log("success");
 	db.close();
	var responseXml = '<?xml version="1.0" encoding="UTF-8" ?>\n<Response>\n<Say>Thanks for your image, we\'ll be in touch.</Say>\n</Response>'
	res.writeHead(200, {"Content-Type": "text/html"});
        res.write(responseXml);
        res.end();
 

};


exports.show = function show(request, response) {
  console.log("Request handler 'show' was called. ="+response);
  fs.readFile("/tmp/test.png", "binary", function(error, file) {
    if(error) {
      response.header(500, {"Content-Type": "text/plain"});
      response.write(error + "\n");
      response.end();
    } else {
      response.writeHead(200, {"Content-Type": "image/png"});
      response.write(file, "binary");
      response.end();
    }
  });
};

//FileRepository.prototype.getFile = function(callback,id) {
//   var gs = new GridStore(this.db,new ObjectID(id), 'r');
//   gs.open(function(err,gs){
//      gs.read(callback);
//   });
// };

exports.gridshow2 = function gridshow2(request, response) {
	
	// Define the file we wish to read
        var gs2 = new mongoose.mongo.GridStore(db, fileId, "r");
        // Open the file
        gs2.open(function(err, gs) {
          // Set the pointer of the read head to the start of the gridstored file
          gs2.seek(0, function() {
            // Read the entire file
            gs2.read(function(err, data2) {
              // Compare the file content against the orgiinal
              assert.equal(data.toString('base64'), data2.toString('base64'));

              db.close();
            });
          });
        });
};

exports.gridshow = function gridshow(request, response) {
    winston.info('Email = '+request.body.email);
    db = mongoose.connection.db
    var gs = new mongoose.mongo.GridStore(db, fileId, 'r');
    gs.open(function(err, gs){
	gs.read(response);
    });
};


// Member register logic
exports.index_post = function(req, res){
    member = new memberModel();
    member.title = req.body.title;
    member.firstname = req.body.firstname;
    member.lastname = req.body.lastname;
    member.mail = req.body.mail;
    
    member.save(function (err) {
        messages = [];
        errors = [];
        if (!err){
            console.log('Success!');
            messages.push("Thank you for you new membership !");
        }
        else {
            console.log('Error !');
            errors.push("At least a mandatory field has not passed validation...");
            console.log(err);
        }
	mongoose.disconnect();
        res.render('index.jade', { title: 'My Registration App', messages: messages, errors: errors });
    });
};

exports.image_put =  function(req, res){
  db = mongoose.connection.db
 
 // Our file ID
 var fileId = new mongoose.mongo.ObjectID();
 console.log('fileId = '+fileId);
   
 var gs = new mongoose.mongo.GridStore(db, fileId, 'w', {
         'content_type': 'image/png',
         'metadata':{
             'author': 'Steven'
         },
         'chunk_size': 1024*28
     });
 // Open the new file
   gs.open(function(err, gridStore) {
            if(!err) {
      gridStore.writeFile('/tmp/temp.png', function(err, doc) {
      if(!err) {
             console.log('Success!!!'+doc.uploadDate);
      }
      else {
   console.log('Error1 = '+err);
      }
      });
     }
     else {
  console.log('Error2 = '+err);
     }
        });
 console.log("success");
 db.close(); 
};


exports.image_get = function(req, res){
 db = mongoose.connection.db

  memberModel.find({},function(err, docs){
  	if( err || !docs) console.log("No users found");
	else 
	    docs.forEach( function(User) {
    		 console.log(User);
		 console.log(User.pictureid);
		 var gs = new mongoose.mongo.GridStore(db, User.pictureid, 'r');
    		 gs.open(function(err,gs){
			// Read the entire file
            		gs.read(function(err, data) {
              			// Compare the file content against the orgiinal
				console.log(data.toString('base64'));
 				res.writeHead('200', {'Content-Type': 'image/png'});
     				res.end(data,'binary');
              			db.close();
            		});

  	    	 });
	    });
  });
};

//exports.image_postJson =  function(req, res){
//	console.log('>>>>image_postJson');
//	// Get DB connection from MongoHQ
//	var Image = mongoose.model('Image');
//	
//	db = mongoose.connection.db
//
//	//Create a Image model object
//	image = new Image();
//	image.categoryGroup = req.body.categoryGroup;
//	image.categoryChild = req.body.categoryChild;
//	image.latitude = req.body.latitude;
//	image.longitude = req.body.longitude;
//
//	// GET image string
//	imageString = req.body.image;
//	console.log('imageString = '+imageString);
//
//	var dataBuffer = new Buffer(imageString, 'base64');
//
//	require("fs").writeFile("/tmp/temp.png", dataBuffer, function(err) {
  //		console.log(err);
//	});
//
//	// Our file ID from MongoHQ
//	var fileId = new mongoose.mongo.ObjectID();
//	console.log('fileId = '+fileId);
//
//	image.filename = fileId;
//	var gs = new mongoose.mongo.GridStore(db, fileId, 'w', {
//	'content_type': 'image/png',
//	'metadata':{
  //         'author': 'Steven'
//	},
//	'chunk_size': 1024*28
//	});
//
//	console.log('GS = '+gs);
//
//	// Open the new file
  //    gs.open(function(err, gridStore) {
    //            console.log('GS Open Error= '+err);
      //          if(!err) {
        //		console.log('no Error = '+gridStore);
//        		gridStore.writeFile('/tmp/temp.png', function(err, doc) {
  //      			if(!err) {
    //        				console.log('Success!!!'+doc.uploadDate);
//				}
//				else {
//					console.log('Error1 = '+err);
//				}
//			});
//		}
//		else {
//			console.log('Error2 = '+err);
//		}
//	});
//	image.save(function (err) {
  //      	messages = [];
    //    	errors = [];
      //  	if (!err){
        //    		console.log('Success!');
          //  		messages.push("Thank you for your new image !");
        //	}
        //	else {
          //  		console.log('Error !');
            //		errors.push("At least a mandatory field has not passed validation...");
            //		console.log(err);
        //	}
	//	console.log("success");
//     	});
//	 
//	mongoose.disconnect();
  //      res.writeHead(200, {"Content-Type": "text/html"});
//    	res.end();
//
//};	

exports.image_postJson =  function(req, res){
	// GET image string
	console.log('req = '+req);
	console.log("Body = "+util.inspect(req.body, true, null));
	var imageString = req.body.image;
	console.log('imageString = '+imageString);

	var dataBuffer = new Buffer(imageString, 'base64');

	require("fs").writeFile("/tmp/temp.png", dataBuffer, function(err) {
  		console.log(err);
	});
	
	saveImageRec(req);
	
};


function saveImageRec(req){
	
	var Image = mongoose.model('Image');
	//Create a Image model object
	image = new Image();
	image.categoryGroup = req.body.categoryGroup;
	image.categoryChild = req.body.categoryChild;
	image.latitude = req.body.latitude;
	image.longitude = req.body.longitude;
	// Our file ID from MongoHQ
	var fileId = new mongoose.mongo.ObjectID();
	console.log('fileId = '+fileId);

	image.filename = fileId;
	image.save(function (err) {
      	messages = [];
        	errors = [];
        	if (!err){
            		console.log('Success!');
            		messages.push("Thank you for your new image !");
        	}
        	else {
            		console.log('Error !');
            		errors.push("At least a mandatory field has not passed validation...");
            		console.log(err);
        	}
		console.log("success");
     	});
	uploadPhoto(fileId);
}

function uploadPhoto(fileId){
	db = mongoose.connection.db;
	var gs = new mongoose.mongo.GridStore(db, fileId, 'w', {
		'content_type': 'image/png',
		'metadata':{
             		'author': 'Steven'
		},
		'chunk_size': 1024*28
	});
	// Open the new file
        gs.open(function(err, gridStore) {
                console.log('GS Open Error= '+err);
                if(!err) {
        		console.log('no Error = '+gridStore);
        		gridStore.writeFile('/tmp/temp.png', function(err, doc) {
        			if(!err) {
            				console.log('Success!!!'+doc.uploadDate);
				}
				else {
					console.log('Error1 = '+err);
				}
			});
		}

		else {
			console.log('Error2 = '+err);
		}
	});
}


exports.image_post =  function(req, res){
	// Get DB connection from MongoHQ
	db = mongoose.connection.db

	//Create a Member model object
	member = new memberModel();
	member.title = req.body.title;
	member.firstname = req.body.firstname;
	member.lastname = req.body.lastname;
	member.mail = req.body.mail;

	winston.info('File = '+req.form);  
	
	// get the temporary location of the file
	var tmp_path = req.files.thumbnail.path;
	winston.info('FileName = '+tmp_path);  
	console.log(req.body);
	console.log(req.files);

	// Renme file to tmp directory
	fs.rename(tmp_path, "/tmp/temp.png", function(err) {
	if (err) {
		fs.unlink("/tmp/temp.png");
		fs.rename(tmp_path, "/tmp/temp.png");
	}
       });

 
	// Our file ID from MongoHQ
	var fileId = new mongoose.mongo.ObjectID();
	console.log('fileId = '+fileId);
   	
	member.filename = fileId;
	var gs = new mongoose.mongo.GridStore(db, fileId, 'w', {
	'content_type': 'image/png',
	'metadata':{
             'author': 'Steven'
	},
	'chunk_size': 1024*4
	});
 	
	// Open the new file
	gs.open(function(err, gridStore) {
		if(!err) {
			gridStore.writeFile('/tmp/temp.png', function(err, doc) {
				if(!err) {
					console.log('Success!!!'+doc.uploadDate);
				}
				else {
					console.log('Error1 = '+err);
				}
			});
		}
		else {
			console.log('Error2 = '+err);
		}
	});
	member.save(function (err) {
        	messages = [];
        	errors = [];
        	if (!err){
            		console.log('Success!');
            		messages.push("Thank you for your new image !");
        	}
        	else {
            		console.log('Error !');
            		errors.push("At least a mandatory field has not passed validation...");
            		console.log(err);
        	}
		console.log("success");
 		db.close(); 
		mongoose.disconnect();
        	res.render('index.jade', { title: 'My Upload', messages: messages, errors: errors });
    	});
};

