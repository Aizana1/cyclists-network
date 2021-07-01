module.exports= function(app){
const express= require('express')
const cookieParser = require("cookie-parser")
const session = require("express-session")
const path = require("path")
const FileStore = require("session-file-store")(session)
const sessionChecker = require('./auth')
const { cookiesCleaner } = require("./auth")
const dbConnection = require("./db-connect")

//app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// app.use('/public', express.static(path.join(__dirname, "/public")));
app.use('/public',express.static('public'));
app.use(sessionChecker, express.static(__dirname + '/public'));

// app.use(, express.static(__dirname + '/public'));

app.set("views", path.join(__dirname, '..', "views"))
app.set("view engine", "hbs")

app.use(cookieParser())

app.use(
  session({
    store: new FileStore(), 
    key: "user_sid", 
    secret: "some secret", 
    resave: false, 
    saveUninitialized: false, 
    cookie: {
      expires: 60000000, 
      httpOnly: false 
    }
  })
)

app.use(cookiesCleaner)

// app.use(express.static(path.join(__dirname, '..', "/public")))



}
