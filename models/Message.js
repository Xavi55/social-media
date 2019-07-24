const mongoose = require('mongoose');
const Message = new mongoose.Schema
({
    topicID:String,
    message:String,
    author:String,
    timestamp:String,
    reply:Boolean,
    likes:Number,
    dislikes:Number,
});

module.exports = mongoose.model('Message',Message);