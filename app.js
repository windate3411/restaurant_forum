const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const chalk = require('chalk')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('./config/passport')
const moment = require('moment')
// set up port
const port = process.env.PORT || 3000

// import models
const db = require('./models')

// set up view engine
app.engine('handlebars', exphbs({
  defaultLayout: 'main', helpers: {
    ifCond: function (a, b) {
      return a === b ? 'selected' : ''
    },
    ifSame: function (a, b, options) {
      return a === b ? options.fn({ active: 'active' }) : ''
    },
    ifConld: function (a, b, options) {
      return a === b ? options.fn(this) : options.inverse(this)
    },
    moments: function (date) {
      return moment(date).fromNow()
    }
  }
}))
app.set('view engine', 'handlebars')

// set up session and flash
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}))
app.use(flash())

// set up passport
app.use(passport.initialize())
app.use(passport.session())

// set up local
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = req.user
  next()
})

// use body parser & method override
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// set up static file
app.use(express.static('public'))
app.use('/upload', express.static(__dirname + '/upload'))

// set up routes
require('./routes')(app, passport)

// set up server
app.listen(port, () => {
  db.sequelize.sync()
  console.log(chalk.green.bold(`you are now listening at port ${port}`))
})