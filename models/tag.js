var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var TagSchema = new Schema({
    label: { type: String, required: true },
    alias: { type: String },
});
module.exports = mongoose.model('Tag', TagSchema);