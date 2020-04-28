const config = require('../config.json');
const mongoose = require('mongoose');
let OKAY=1
try
{
    const URI = config.URI;
    mongoose.connect(URI, {useNewUrlParser:true, useUnifiedTopology:true})
    .then(db => 
        {
            console.log('mongoDB OKAY')
        })
    .catch(err =>
        {
            console.log(`mongoDB ERR: ${err}`);
        });
}
catch (ReferenceError)
{
    OKAY=0
    console.log('ERR: config file not found');
}
module.exports = mongoose;