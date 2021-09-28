const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// user database schema
const UserSchema = new Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true, select: false },

    phoneNo: { type: String, required: true },

    role: { type: String, default: "user", enum: ["user", "admin"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
