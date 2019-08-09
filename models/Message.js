const mongoose = require('mongoose');
const Message = new mongoose.Schema
({
    topicID:String,
    message:String,
    author:String,
    timestamp:String,
    replyTo:String,
    likes:Number,
    dislikes:Number,
    rank:Number
});

module.exports = mongoose.model('Message',Message);