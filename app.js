const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const chalk = require('chalk')
// set up port
const port = process.env.PORT || 3000

// set up view engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// use body parser & method override
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// set up static file
app.use(express.static('public'))

// set up routes
app.use('/', require('./routes/index'))

// set up server
app.listen(port, () => console.log(chalk.green.bold(`you are now listening at port ${port}`)))