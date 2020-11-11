var mongoose=require("mongoose");
var availability=mongoose.Schema({
    train:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"train"
    },
    date:Date,
    a:{type:Number ,default:100},
    b:{type:Number ,default:100},
    c:{type:Number ,default:100}
});
module.exports=mongoose.model("availability",availability);