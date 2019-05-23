var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const Tag = require('./tag');
const Gallery = require('./gallery');
const Styleproduct = require('./styleproduct');
//var User = require('./user');
var productSchema = new Schema({
    name: { type: String },
    alias: { type: String },
    slug: { type: String },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CatProduct'
    },
    arr_style_ids: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Styleproduct'
        }
    ],
    left: { type: Number },
    right: { type: Number },
    imagePath: { type: String },
    price: { type: Number },
    price_old: { type: Number },
    description: { type: String },
    detail: { type: String },
    imageNumber: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gallery'
    },
    author: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    },
    comments: [
        {
            author: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Admin',
            },
            text: String
        }
    ],
    tags:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Tag'
            }
        ],
    title_seo: { type: String },
    description_seo: { type: String },
    keyword_seo: { type: String },
})
// this is a kind of adding custom method to model
productSchema.methods.savePostTags = async function(request){
    // first save tag
    const tags = request.tags.map(function(item, index){
        return { label : item };  // this is loop and prepare tags array to save,
    })
    let savedtags
    try{
        savedtags = await Tag.insertMany(tags, {ordered:false}); // ordered falsee means however if we got error in one object, it will not stop and continue save to another objects like this             
    }catch(err){
        if(err.code == "11000"){
            savedtags = await Tag.find({ "label" : {"$in": request.tags}});
        }else{
            return err;
        }
    }

    // second save post
    let savedpost
    try{
        this.set(request);
        this.tags = savedtags.map(function(item, index){
            return item._id
        })
        savedpost = await this.save();
    }catch(err){
        return err;
    }
    return {post:savedpost, tags:savedtags};    
}
    
    productSchema.methods.comment = function(c){
        this.comments.push(c);
        return this.save();
    }
module.exports = mongoose.model('Product', productSchema);