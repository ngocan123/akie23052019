var mongoose = require('mongoose');
var Schema = mongoose.Schema;
let Product = require('./product');
var CatProductSchema = new Schema({
    name: { type: String },
    description: { type: String },
    color: { type: String },
    childs: { type: Array },
    children: { type: Array },
    styles: { type: Array },
    arr_id_product:{ type: Array },
    parent_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CatProduct'
    },
    alias: { type: String },
    slug: { type: String },
    imageNumber: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gallery'
    },
    imagePath: { type: String },
    galleryNumber: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Gallery',
        }
    ],
    title_seo: { type: String },
    description_seo: { type: String },
    keyword_seo: { type: String },
});
module.exports = mongoose.model('CatProduct', CatProductSchema);