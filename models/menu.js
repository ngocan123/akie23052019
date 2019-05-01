var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var MenuSchema = new Schema({
    name: { type: String },
    parent_id: { type: String },
    url: { type: String },
    path: { type: String },
    link: { type: String },
    position: [
        {
            data: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Positionmenu',
            },
            text: { type: String }
        }
    ],
    description: { type: String }
});
module.exports = mongoose.model('Menu', MenuSchema);