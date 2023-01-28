var mongoose=require('mongoose');
const Schema=mongoose.Schema
var object=["butterfly","cat","cow","dog","elephant","hen","horse","sheep","spider","squirille"]
const StudentSchema = new Schema({
    userName:{
        type: String,
        required:true
    },
    emailId:{
        type:String,
        required:true
    },
    mobileNumber:{
        type:Number,
        required:true
    },
    objectSequence:{
        type:[String],
        require:true
    }
},{
    timestamps:true
});
 
const Blog = mongoose.model('Blog',StudentSchema);
module.exports=Blog;