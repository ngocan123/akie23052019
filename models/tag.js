var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var TagSchema = new Schema({
    label: { type: String, required: true },
    name: { type: String, required: true },
    alias: { type: String },
    title_seo: { type: String },
    description_seo: { type: String },
    keyword_seo: { type: String },
});
module.exports = mongoose.model('Tag', TagSchema);