import mongoose from "mongoose";
import bcrypt from "bcrypt";
const { Schema } = mongoose;

const profilePicSchema = new Schema({
  publicId:{
    type:String,
    required:true
  },
  secureUrl:{
    type:String,
    required:true
  }
},{
  _id:false
}
)



const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      unique:true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase:true
    },
    password: {
      type: String,
      required: true,
      select:false
    },
    role:{
      type:String,
      enum: ["admin","user"],
      default: "user"
    },
    isOnline:{
      type:Boolean,
      default:false
    },
    profilePic:{
     type:profilePicSchema,
     required:false
    },
    bio:{
      type:String,
      minlength:100
    },
    refreshToken:{
      type:String,
      select:false
    }
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = async function(enteredPassword)
{
  return await bcrypt.compare(enteredPassword,this.password);
}

const User = mongoose.model("User", userSchema);
export default User;


// fullname:{
//       type:String,
//       required:true,
//       trim:true,
//     },