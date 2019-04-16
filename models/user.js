var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var userSchema = new Schema({
    name: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    zalo: { type: String },
    facebook: { type: String },
    gplus: { type: String },
    website: { type: String },
    note: { type: String },
});
userSchema.methods.encryptPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};
userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password)
};
module.exports = mongoose.model('User', userSchema);