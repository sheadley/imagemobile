/*!
* Demo registration application
* Copyright(c) 2011 Jean-Tiare LE BIGOT <admin@jtlebi.fr>
* MIT Licensed
*/

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var MemberSchema = new Schema({
    id        : ObjectId,
    pictureid : ObjectId,
    title     : { type: String, required: true, enum: ['Mr', 'Mrs', 'Mme', 'Miss'] },
    lastname  : { type: String, required: true, uppercase: true, trim: true},
    firstname : { type: String, required: true},
    filename : { type: String, required: true},
    mail      : { type: String, trim: true, index: { unique: true, sparse: true } },
    date      : Date
});

// Date setter
MemberSchema.path('date')
    .default(function(){
        return new Date()
    })
    .set(function(v){
        return v == 'now' ? new Date() : v;
    });

module.exports = mongoose.model('Members', MemberSchema);
