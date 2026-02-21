import mongoose, {Schema} from "mongoose";
const messageSchema = new Schema({
  sender:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  content:{
    type:String,
    reqired:true,
    trim:true
  },
  seenBy:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
  }],
  chat:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Chat",
  }
},
{
  timestamps:true
}) 