require('dotenv').config()
const path = require('path')
const express = require('express')
const cors = require('cors')
const logger = require('morgan')
const routes = require('./routes')

const passport = require('passport')
var session = require('express-session')

const app = express()
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors({
  origin: true,
  methods: ['GET', 'POST']
}))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, './views'))
app.use(express.static(path.join(__dirname, './public')))

app.use(session(
  {
    secret: 'SuperSecretCode1234',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 3600000
    }
  }
))

app.use(passport.initialize())
app.use(passport.session())
passport.serializeUser((user, next) => next(null, user))
passport.deserializeUser((user, next) => next(null, user))

app.use(routes)


const port = 8080
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

