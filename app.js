import express from "express"
import dotenv from "dotenv"
import database from "./db/db.js"
import routes from "./routes/index.js"
import path from "path"
import passport from "passport"
import session from "express-session"
import { initilizingPassport } from "./config/passport.js"
import auth from "./routes/auth.js"
import stories from "./routes/stories.js"
import methodOverride from "method-override"

const app = express()

//@setting up view engine
app.set("view engine", "ejs")


//@static folder setup
app.use(express.static(path.join(path.resolve(), "public")))
app.use(express.urlencoded({ extended: false }))

//@method override
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method
    delete req.body._method
    return method
  }
}))

//@Load config
dotenv.config({
  path: "./config/config.env"
})

const __dirname = path.resolve()

initilizingPassport(passport)

//@setting up express-session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}))

//@passport middleware
app.use(passport.initialize())
app.use(passport.session())

//@database connection
database();

//@Routes setup
app.use("/", routes)
app.use("/auth", auth)
app.use("/stories", stories)

app.use(express.static(path.join(__dirname, '/dist')))


const PORT = process.env.PORT || 4000

app.listen(PORT,
  console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)