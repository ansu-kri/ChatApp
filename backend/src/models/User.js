const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  password: { type: String, required: true, minlength: 6, },
  profilePic: { type: String, default: "", },
  role: { type: String, enum: ["member", "admin", "moderator"], default: "member", },
  department: { type: String, default: "", },
  title: { type: String, default: "", },
  bio: { type: String, maxlength: 200, default: "", },
  isActive: { type: Boolean, default: true, },
  lastSeen: { type: Date, default: Date.now, },
  channels: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
    },
  ],
},
  { timestamps: true } // createdat and updatedat
);

//virtual for online status - handle via socket
userSchema.virtual("isOnline").get(function () {
  return false //will be set dynamically
});

module.exports = mongoose.model("User", userSchema)
