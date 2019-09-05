const routes = require('./routes')
const apis = require('./api')
module.exports = app => {
  app.use('/', routes)
  app.use('/api', apis)
}