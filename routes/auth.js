import express from "express";
const router = express.Router();
import passport from "passport";

//@desc Auth with Google
//@route GET/auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

//@desc google auth callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Successful authentication, redirect home.
        res.redirect('/Dashboard');
    });

// @desc    Logout user
// @route   /auth/logout
router.get('/logout', (req, res, next) => {
    req.logout((error) => {
        if (error) { return next(error) }
        res.redirect('/')
    })
})


export default router