import mongoose from "mongoose";
const friendSchema = new mongoose.Schema({
  sender:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
   receiver:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  status:{
    type:String,
    enum:["pending","rejected","accepted"],
  }
},{
  timestamps:true
})


const Friend =mongoose.model("Friend",friendSchema);
export default Friend;