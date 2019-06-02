const mongoose = require('mongoose');
const Topic = new mongoose.Schema
({
    topicName:String,
    subtext:String,
    'author':String,
    'timestamp':String
});

module.exports = mongoose.model('Topic',Topic);