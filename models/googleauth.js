const mongoose = require("mongoose");

const auth = new mongoose.Schema({
  email: { type: String, required: true },
  userId: { type: String, required: true },
  extraId: { type: String, default: null },
  isAdmin: { type: Boolean, default: false },
  block: { type: Boolean, default: false },
});

module.exports = mongoose.model("gauth", auth);
