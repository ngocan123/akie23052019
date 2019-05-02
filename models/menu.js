var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var MenuSchema = new Schema({
    name: { type: String },
    parent_id: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu'
    },
    url: { type: String },
    path: { type: String },
    link: { type: String },
    sort: { type: Number },
    imageNumber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gallery',
    },
    imagePath: { type: String },
    children: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Menu',
            },
            text: { type: String }
        }
    ],
    description: { type: String }
});
module.exports = mongoose.model('Menu', MenuSchema);