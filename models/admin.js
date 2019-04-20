var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
const Gallery = require('./gallery');
var adminSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String },
    image: { type: String },
    birthday: { type: Date },
    phone: { type: String },
    zalo: { type: String },
    facebook: { type: String },
    gplus: { type: String },
    website: { type: String },
    address: { type: String },
    active: { type: Number },
    imageNumber: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gallery'
    },
    imagePath: { String }
});
adminSchema.methods.encryptPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};
adminSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password)
};
module.exports = mongoose.model('Admin', adminSchema);