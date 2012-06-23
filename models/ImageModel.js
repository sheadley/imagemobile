var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var ImageSchema = new Schema({
    id        : ObjectId,
    pictureid : ObjectId,
    categoryGroup     : { type: String, required: true},
    categoryChild  : { type: String, required: true},
    latitude : { type: String, required: true},
    longitude : { type: String, required: true},
    filename : { type: String, required: true},
    date      : Date
});

// Date setter
ImageSchema.path('date')
    .default(function(){
        return new Date()
    })
    .set(function(v){
        return v == 'now' ? new Date() : v;
    });

module.exports = mongoose.model('Image', ImageSchema);
