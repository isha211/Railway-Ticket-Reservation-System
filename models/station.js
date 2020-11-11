var mongoose=require("mongoose");
var stationSchema=mongoose.Schema({
    name:String
});
module.exports=mongoose.model("station",stationSchema);