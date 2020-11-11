var mongoose=require("mongoose");
var local=require("passport-local-mongoose");
var userSchema=mongoose.Schema({
    username:String,
    password:String
});
userSchema.plugin(local);
module.exports=mongoose.model("user",userSchema);