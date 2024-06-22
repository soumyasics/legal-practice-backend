const mongoose = require("mongoose");

const statusSchema = mongoose.Schema({
    caseId:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'cases'

    },
    userId: {
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"users"
    },
    
        advocateId:{
            type:mongoose.Schema.Types.ObjectId,
            default:null,
            ref:'advocates'

        },
        status:{
            type:String,
            required: true,
        },
        date:{
            type:Date,
        }, 
        description:{
            type:String
        }

});
module.exports = mongoose.model('casestatus', statusSchema)

