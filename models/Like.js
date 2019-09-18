const mongoose = require('mongoose');
const Like = new mongoose.Schema
({
    userID:String,
    messageID: String, 
    liked: Number
});

module.exports = mongoose.model('Like',Like);