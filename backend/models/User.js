import mongoose from "mongoose";
import bcrypt from "bcrypt";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
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
    refreshToken:{
      type:String,
      select:false
    }
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save",  async function (next) {
  try {
    if (!this.isModified("password")) return next();
    const hasedPassword = await bcrypt.hash(this.password, 10);
    this.password = hasedPassword;
    return next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.matchPassword = async function(enteredPassword)
{
  return await bcrypt.compare(enteredPassword,this.password);
}

const User = mongoose.model("User", userSchema);
export default User;
