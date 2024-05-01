import express from "express";
import ensureAuth from "../middleware/auth.js"
import Story from "../models/story.js"
import { truncate } from "../helpers/help.js";

const router = express.Router()

//@GET /stories/add
router.get("/add", (req, res) => {
    res.render("addstory")
})

//post route for form data
router.post("/", ensureAuth, async (req, res) => {

    try {
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect("/dashboard")
    } catch (error) {
        console.log(error)
    }
})

// @get route
router.get("/", ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ status: 'public' }).populate('user')
        for (var item in stories) {
            var result = truncate(stories[item].body, 60)
            stories[item]['body'] = result
        }
        res.render("stories", { stories })
    } catch (err) {
        console.log("Error is : ", err)
        res.render("500")
    }
})

// @get edit route 
//@get stories/edit/:id
router.get("/edit/:id", ensureAuth, async (req, res) => {
    try {
        const story = await Story.findOne({ _id: req.params.id }).lean()

        if (!story) {
            return res.render("404")
        }

        if (story.user != req.user.id) {

            res.redirect("/stories")

        } else {

            res.render("edit", { story })
        }

    } catch (error) {
        console.log(error)
        res.render("500")
    }
})


// @Update story 
//PUT stories/id
router.put("/:id", ensureAuth, async (req, res) => {

    try {
        let story = await Story.findById(req.params.id).lean()
        if (!story) {
            res.render("404")
        }

        if (story.user != req.user.id) {
            res.redirect("/stories")
        }
        else {
            story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
                new: true,
                runValidators: true,
            })

            res.redirect("/dashboard")
        }


    } catch (error) {
        res.render("500")
    }

})

// @get edit route 
//@get stories/user/:id
router.get("/user/:id", ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ _id: req.params.id }).populate('user')

        if (!stories) {
            res.render("404")
        }
        res.render("storyProfile", { stories })

    } catch (err) {
        res.render("500")
        console.log(err)
    }
})



//@all user stories
//@get stories/userstories/:id
router.get("/userstories/:userId", ensureAuth, async (req, res) => {

    try {

        const user_stories = await Story.find({ user: req.params.userId, status: 'public' }).populate('user').lean()
        for (var item in user_stories) {
            var result = truncate(user_stories[item].body, 60)
            user_stories[item]['body'] = result
        }
        res.render("userstories", { user_stories })

    } catch (error) {
        res.render("500")
        console.error("Error", error)
    }



})


//@delete route
//@delete stories/:id
router.delete("/:id", ensureAuth, async (req, res) => {
    try {

        await Story.deleteOne({ _id: req.params.id })
        res.redirect('/dashboard')

    } catch (error) {
        console.log("error")
    }
})

// @desc search route
// GET request /stories/:query
router.get("/search/:query", async (req, res) => {

    try {
        const stories = await Story.find({ title: new RegExp(req.query.query, 'i'), status: 'public' }).populate('user').lean()
        for (var item in stories) {
            var result = truncate(stories[item].body, 60)
            stories[item]['body'] = result
        }
        res.render("stories", { stories })

    } catch (error) {

        console.log("error is : ", error)
        res.render("404")

    }

})


export default router;