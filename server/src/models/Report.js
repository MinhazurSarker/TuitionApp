const mongoose = require("mongoose");
const ReportSchema = new mongoose.Schema({
    by:        { type: String },
    reported:  { type: String },
    type:      { type: String },
    reason:    { type: String },
    desc:      { type: String },
    createdAt: { type: Date, default: Date.now, index: { expires:  3600*24*30 } }
  
},

);
const Report = mongoose.model("Report", ReportSchema);
module.exports = Report;