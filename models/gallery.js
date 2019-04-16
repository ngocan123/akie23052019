var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var GallerySchema = new Schema({
    title: { type: String },
    path: { type: String },
    size: { type: Number },
    filename: { type: String },
    destination: { type: String },
});
module.exports = mongoose.model('Gallery', GallerySchema);