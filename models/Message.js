const mongoose = require('mongoose');
const Message = new mongoose.Schema
({
    topicID:String,
    message:String,
    author:String,
    timestamp:String,
    reply:String
});

module.exports = mongoose.model('Message',Message);