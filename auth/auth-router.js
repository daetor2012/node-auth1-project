const express = require("express")
const users = require("../users/users-model")
const bcrypt = require("bcryptjs")
const { restrict } = require("../middleware/restrict")

const router = express.Router()

router.post("/register", async (req, res, next) => {
    try {
        const { username } = req.body
        const user = await users.findBy({ username }).first()

        if(user) {
            return res.status(409).json({ message: "User already taken" })
        }

        res.status(201).json(await users.add(req.body))
    } catch(err) {
        next(err)
    }
})

router.post("/login", async (req, res, next) => {
    try {
        const { username, password } = req.body
        const user = await users.findBy({ username }).first()
        const passwordValid = await bcrypt.compare(password, user.password)

        if(!user || !passwordValid) {
            return res.status(401).json({ message: "Invalid credentials" })
        }
        req.session.user = user
        res.json({ message: `Welcome ${user.username}` })
    } catch(err) {
        next(err)
    }
})

router.get("/logout", (req, res, next) => {
    req.session.destroy((err) => {
        if(err) {
            next(err)
        } else {
            res.json({  message: "Logged out" })
        }
    })
})

module.exports = router;