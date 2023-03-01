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
    password:{
        type:String,
        required:true
    },
    objectSequence:[String],
    totp:{
        type:Number
    }
},{
    timestamps:true
});
 
const authEntry = mongoose.model('authEntry',StudentSchema);
module.exports=authEntry;