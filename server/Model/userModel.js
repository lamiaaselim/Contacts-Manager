const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: String,
  password: String,
});

module.exports = mongoose.model("User", schema);
