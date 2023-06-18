const mongoose = require("mongoose");

const auth = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  resetToken: { type: String },
  resetTokenExpire: { type: Date },
  extraId: { type: String, default: null },
  isAdmin: { type: Boolean, default: false },
  block: { type: Boolean, default: false },
});

module.exports = mongoose.model("auth", auth);
