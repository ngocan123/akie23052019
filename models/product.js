var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var User = require('./user');
var productSchema = new Schema({
    name: { type: String, required: true },
    alias: { type: String, required: true },
    category_id: { type: Number },  
    imagePath: { type: String },
    imageNumber: { type: Number },
    price: { type: Number },
    description: { type: String },
    detail: { type: String },
    author: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
     },
    comments: [
        {
            author: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            text: String
        }
     ],
     tags:[
             {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Tag'
             }
        ]
});

// this is a kind of adding custom method to model
productSchema.methods.savePostTags = async function(request){
        // first save tag
        const tags = request.tags.map(function(item, index){
            return { title : item };  // this is loop and prepare tags array to save,
        })
    
        let savedtags
        try{
            savedtags = await Tag.insertMany(tags, {ordered:false}); // ordered falsee means however if we got error in one object, it will not stop and continue save to another objects like this             
        }catch(err){
            if(err.code == "11000"){
                savedtags = await Tag.find({ "title" : {"$in": request.tags}});
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