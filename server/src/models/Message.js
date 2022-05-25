const mongoose = require("mongoose");
const MessageSchema = new mongoose.Schema({
    sender:        {type: String},
    chatId:        {type: String},
    text:          {type: String},
    image:         {type: String},
    createdAt:     {type: Date,default:Date.now,index:{ expires: 3600*24*10 }}
});
const Message = mongoose.model("Message", MessageSchema);
module.exports = Message;