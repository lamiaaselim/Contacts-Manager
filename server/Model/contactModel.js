const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: String,
  phone: String,
  address: String,
  notes: String,
  isLocked: { type: Boolean, default: false },
});

module.exports = mongoose.model("Contact", schema);
