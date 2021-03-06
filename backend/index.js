const path = require('path');
const express = require("express");
const PORT = process.env.PORT || 4000;
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const config = require("./config/db");
const app = express();
const https = require("http").Server(app);
const io = require('socket.io')(https);
require("./chat-socket")(io);


//configure database and mongoose
mongoose.set("useCreateIndex", true);
mongoose
    .connect(config.database, { useNewUrlParser: true })
    .then(() => {
        console.log("Database is connected");
    })
    .catch(err => {
        console.log({ database_error: err });
    });
// db configuaration ends here

//registering cors
app.use(cors());

//configure body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan("dev")); // configire morgan

const userRoutes = require("./route/user"); //bring in our user routes
app.use("/user", userRoutes);

// The webapp is served over every other route:
app.use("/", express.static(path.join(__dirname, "../frontend/dist/")))
app.use("/*", (req, res) => res.sendFile(path.resolve("../frontend/dist/index.html")))

app.use((err, req, res, next) => {
    
    if (err.errors) {   // mongoose error
        let message = ""

        Object.keys(err.errors).forEach(key => {
            if (message.length > 0)
                message += "\n";

            message += err.errors[key].message;
        });

        return res.status(400).json({ message });
    }

    res.status(400).json(err)
})
https.listen(PORT, () => {
    console.log(`App is running on ${PORT}`);
});
