const mongoose = require("mongoose");
const TRXSchema = new mongoose.Schema({
  userId:     { type: String, required: true },
  name:       { type: String, required: true },
  email:      { type: String, required: true },
  phone:      { type: String, required: true },
  plan:       { type: String, required: true },
  days:       { type: String, required: true },
  amount:     { type: String, required: true },
  status:     { type: String, required: true ,default:"pending"},
  createdAt:  { type: Date, default: Date.now, index: { expires: 3600*24*30 } }
});
const TRX = mongoose.model("TRX", TRXSchema);
module.exports = TRX;