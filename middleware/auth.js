export const ensureGuest = (req, res, next) => {

    if (!req.isAuthenticated()) {
        return next()
    } else {
        res.redirect('/dashboard')
    }

}

const ensureAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }
    else {
        res.redirect('/')
    }
}

export default ensureAuth;