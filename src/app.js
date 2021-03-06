import express from 'express'
import path from 'path'
import logger from 'morgan'
import bodyParser from 'body-parser'
import session from 'express-session'
import passport from 'passport'
import winston from 'winston'

import router from './router'
import authRouter from './auth'
import vkRouter from './vk'

const { createLogger, format, transports } = winston
const { printf } = format 

const myFormat = printf(info => {
  return `${info.level.toUpperCase()}: ${info.message}`;
})

const log = createLogger({
  // levels: winston.config.syslog.levels,
  format: myFormat,
  transports: [
    new transports.Console(),
    new transports.File({
      filename: 'combined.log',
      level: 'error'
    })
  ]
})

const app = express()
app.disable('x-powered-by')

// View engine setup
app.set('views', path.join(__dirname, '../views'))
app.set('view engine', 'pug')

app.log = log
app.use(logger('dev', {
  skip: () => app.get('env') === 'test'
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({ secret: 'keyboard cat' }))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(path.join(__dirname, '../public')))

// Check auth middleware
function loggedIn(req, res, next) {
  if (req.user) {
      next()
  } else {
      res.redirect('/')
  }
}

// Routes
app.use('/', router)
app.use('/', authRouter) // /auth & /login'out
app.use('/vk', loggedIn, vkRouter)

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// Error handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  log.error(err)
  res
    .status(err.status || 500)
    .render('error', {
      message: err
    })
})

export default app
