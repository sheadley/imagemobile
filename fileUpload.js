var mongoose = require('mongoose');
var mongo = require('mongodb'),
  Server = mongo.Server,
  GridStore = mongo.GridStore,
  Db = mongo.Db;
  
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;  

var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('exampleDb', server);

var gridStore = new GridStore(db, ObjectId, "w", {root:'fs'});
gridStore.chunkSize = 1024 * 256;


var gs = new mongodb.GridStore(db, "test.png", "w", {
        "content_type": "image/png",
        "metadata":{
            "author": "Daniel"
        },
        "chunk_size": 1024*4
    });

gridStore.open(function(err, gridStore) {
 Step(
   function writeData() {
     var group = this.group();

     for(var i = 0; i < 1000000; i += 5000) {
       gridStore.write(new Buffer(5000), group());
     }
   },

   function doneWithWrite() {
     gridStore.close(function(err, result) {
       console.log("File has been written to GridFS");
     });
   }
 )
});


function opendStore(err, db) {
    if (err) throw err;

    database = db;
    var gridStore = new GridStore(db, "somepicture", "w", {
        'content_type': 'image/jpeg',
        'metadata': { 'tes0r': 2342 },
        'root': 'images'
      });