const express =require('express')
const useMiddleware=require('./middleware')

const useErrorHandlers= require('./middleware/error-handlers')

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const mapRouter = require ('./routes/map')
const newRouter = require ('./routes/new')

const app = express()

useMiddleware(app)


app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/map', mapRouter)
app.use('/new', newRouter)

useErrorHandlers(app)
module.exports=app
