const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
    text: {
        type: String,
        maxlength: 2048
    },
    userId: String,
    userName: String,
    userPicImgurId: String,
    imageImgurId: String,
    time: Number,
    startedTypingTime: Number
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
