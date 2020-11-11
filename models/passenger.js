var mongoose=require("mongoose");
var passengerSchema=mongoose.Schema({
    name:String,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    ticket:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"ticket"
    }]
});
module.exports=mongoose.model("passenger",passengerSchema);