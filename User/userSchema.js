const mongoose= require("mongoose");

const userSchema=mongoose.Schema({
    name:{
        type:String,

        required:true,
       
    },
   
    gender:{
        type:String,
      
        required:true,
       
    },
    contact:{
        type:String,
       
        required:true,
    
    },
    email:{
        type:String,
        unique:true,
        required:true,
       
        dropDups: true
    },
    password:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    dob:{
        type:Date,
        required:true
    },
    
    isActive:{
        type:Boolean,
        default:true
    },
    profilePic:{
        type:Object
    },
    nationality:{
        type:String,
        required:true
    },
});
module.exports=mongoose.model('users',userSchema)

