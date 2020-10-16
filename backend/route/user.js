const express = require("express");
const router = express.Router();
const User = require("../model/User")
const auth = require("../auth")

router.post("/register", async (req, res, next) => {
    try {
        const user = new User({
            name: req.body.name,
            email: req.body.email || null,
            password: req.body.password || Math.random().toString(36).substr(2, 8)
        });
        await user.save();
        let data = await User.findById(user.id || console.error("no id"));
        const token = await user.generateAuthToken(); // here it is calling the method that we created in the model
        res.status(201).json({ data, token });
    } catch (err) {
        next(err)
    }

});
router.post("/login", async (req, res, next) => {
    try {
        const user = await User.findByCredentials(req.body.name, req.body.password);
        const token = await user.generateAuthToken();
        res.status(201).json({ user, token });
    } catch (err) {
        next(err)
    }
});
router.get("/me", auth, async (req, res) => {
    res.json(req.userData)
});

module.exports = router;
