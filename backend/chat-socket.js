const jwt = require("jsonwebtoken");
const jwtSecret = require("./config/jwtSecret");
const Message = require("./model/Message")

function initClientSocket(socket, user) {

    console.log(user.name + " is verbonden!", user)

    let currentMsg = null

    socket.on("typing", async text => {

        if (currentMsg == null) {
            currentMsg = new Message({
                userId: user._id,
                userName: user.name,
                startedTypingTime: Date.now() / 1000 | 0,
                userPicImgurId: user.picImgurId
            })
        }
        currentMsg.text = text
        currentMsg.time = Date.now() / 1000 | 0

        try {
            await currentMsg.save()
        } catch (e) {
        }
        socket.broadcast.emit("message", currentMsg)

        if (!text) {
            currentMsg.delete()
            currentMsg = null
            return
        }
    })

    socket.on("send", () => {

        if (currentMsg == null)
            return console.error("client tried to send empty message")

        // send to sender:
        socket.emit("message", currentMsg)

        currentMsg.save()
        currentMsg = null
    })

    socket.on('disconnect', () => console.log("doei " + user.name))
}

module.exports = io => {

    io.on('connection', socket => {
        console.log("hi someone connected")

        let jwtVerified = false

        socket.on('jwt', token => {

            if (jwtVerified)
                return console.error("client sent jwt again")

            let user = jwt.verify(token, jwtSecret)
            jwtVerified = true

            initClientSocket(socket, user)
        })
    })

}
