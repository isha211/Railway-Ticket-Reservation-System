var mongoose=require("mongoose");
var trainSchema=mongoose.Schema({
    name:String,
    from:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"station"
    },
    to:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"station"
    },
    /*mon:{type:Boolean,default:false},
    tue:{type:Boolean,default:false},
    wed:{type:Boolean,default:false},
    thur:{type:Boolean,default:false},
    fri:{type:Boolean,default:false},
    sat:{type:Boolean,default:false},
    sun:{type:Boolean,default:false}*/
    week:[String]
});
module.exports=mongoose.model("train",trainSchema);  