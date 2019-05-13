var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var MenuSchema = new Schema({
    name: { type: String },
    title: { type: String },
    parent_id: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu'
    },
    parent: { type: Array },
    url: { type: String },
    path: { type: String },
    link: { type: String },
    sort: { type: Number },
    imageNumber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gallery',
    },
    imagePath: { type: String },
    childrens: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Menu',
            },
            title: { type: String },
            text: { type: String },
            name: { type: String }
        }
    ],
    childs: { type: Array },
    children: { type: Array },
    description: { type: String }
});
MenuSchema.methods.getMenu = function(request){
    return 'Model Menu'
}
module.exports = mongoose.model('Menu', MenuSchema);