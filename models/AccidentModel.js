var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var AccidentSchema = new Schema({
    id        : ObjectId,
    title     : { type: String, required: true, enum: ['Mr', 'Mrs', 'Mme', 'Miss'] },
    lastname  : { type: String, required: true, uppercase: true, trim: true},
    firstname : { type: String, required: true},
    address   : { type: String, required: true},
    city      : { type: String, required: true},
    state     : { type: String, required: true},
    zipcode   : { type: String, required:true},
    mail      : { type: String, trim: true, index: { unique: true, sparse: true } },
    date      : Date
});

// Date setter
AccidentSchema.path('date')
    .default(function(){
        return new Date()
    })
    .set(function(v){
        return v == 'now' ? new Date() : v;
    });

module.exports = mongoose.model('Accident', AccidentSchema);