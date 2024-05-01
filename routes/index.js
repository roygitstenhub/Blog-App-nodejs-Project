import express from "express";
import ensureAuth, { ensureGuest } from "../middleware/auth.js"
import Story from "../models/story.js"
const router = express.Router()


//@home page GET/
router.get("/", ensureGuest, (req, res) => {
    res.render("login")
})

router.get("/dashboard", ensureAuth, async (req, res) => {
    const { displayName } = req.user
    try {
        const stories = await Story.find({ user: req.user.id }).lean()
        res.render("dashboard", { name: displayName, stories })
    } catch (error) {
        console.log(error)
    }
})




export default router