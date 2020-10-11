const express = require("express");
const router = express.Router();
const User = require("../model/User")
const auth = require("../auth")

router.post("/register", async (req, res) => {
    try {
        const user = new User({
            name: req.body.name,
            email: req.body.email || null,
            password: req.body.password || Math.random().toString(36).substr(2, 8)
        });
        let data = await user.save();
        const token = await user.generateAuthToken(); // here it is calling the method that we created in the model
        res.status(201).json({ data, token });
    } catch (err) {
        res.status(400).json({ err });
    }

});
router.post("/login", async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.name, req.body.password);
        const token = await user.generateAuthToken();
        res.status(201).json({ user, token });
    } catch (err) {
        console.log(err.toString())
        res.status(400).json({ err });
    }
});
router.get("/me", auth, async (req, res) => {
    res.json(req.userData)
});

module.exports = router;
