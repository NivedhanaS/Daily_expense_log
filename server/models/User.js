const mongoose = require("mongoose");

const userSchema= new mongoose.Schema({
    name:String,
    email: {type : String,unique:true },
    password:String,
    income: { type: Number, default: 10000 },
    savingGoal: { type: Number, default: 20 },
    },{timestamps:true});

module.exports = mongoose.model("User",userSchema);
