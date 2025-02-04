const mongoose = require('mongoose');

//Creating Post Schema as in Skeletoon to store information
const postSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
        //OnjectID id taken from user.js
    },
    date:{
        type: Date,
        default: Date.now
    },
    content: String,
    likes:[
        {type: mongoose.Schema.Types.ObjectId, ref: "user"}
    ],
})

module.exports = mongoose.model('post',postSchema);