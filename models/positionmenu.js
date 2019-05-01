var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var PositionmenuSchema = new Schema({
    name: { type: String },
    keyname: { type: String },
    description: { type: String }
});
module.exports = mongoose.model('Positionmenu', PositionmenuSchema);