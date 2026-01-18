const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name:{
        type:String,
        required:true,
        trim:true,
    },
    birthday:{
        type:Date,
        required:false,
    },
    role: {
      type: String,
      enum: ["admin", "customer"],
      default: "customer",
    },
    refreshToken: {
      type: String,
      select: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
