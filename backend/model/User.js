const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecret = require("../config/jwtSecret");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Wat is je naam?"],
        unique: true,
        minlength: 1,
        maxlength: 64
    },
    email: {
        type: String,
        select: false
    },
    password: {
        type: String,
        required: [true, "Wachtwoord is verplicht"],
        select: false,
        minlength: 3,
        maxlength: 256
    },
    admin: Boolean,
    joinedTime: Number,
    picImgurId: String
});

userSchema.path("name").validate(async function (name) {

    if (!this.isNew)
        return true;

    const userWithSameName = await User.findOne({ name });
    return userWithSameName == null;

}, "Naam is al in gebruik, probeer een andere naam :)")

//this method will hash the password before saving the user model
userSchema.pre("save", async function (next) {
    const user = this;
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

//this method generates an auth token for the user
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id, name: user.name, email: user.email, admin: user.admin },
        jwtSecret);
    return token;
};

//this method search for a user by email and password.
userSchema.statics.findByCredentials = async (name, password) => {
    const user = await User.findOne({ name }).select("+password")
    if (!user)
        throw { message: "Er is geen account met deze naam!" };

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch)
        throw { message: "Wachtwoord klopt niet!" };

    return await User.findById(user._id);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
