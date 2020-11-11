var mongoose=require("mongoose");
var ticketSchema=mongoose.Schema({
    train:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"train"
    },
    date:Date,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    passenger:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"passenger"
    }],
    price:Number,
    seat:[String],
    status:{type:Boolean,default:true}
});
module.exports=mongoose.model("ticket",ticketSchema);