module.exports= function(app){
const express= require('express')
const cookieParser = require("cookie-parser")
const session = require("express-session")
const path = require("path")
const FileStore = require("session-file-store")(session)

const { cookiesCleaner } = require("./auth")
const dbConnection = require("./db-connect")

//app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.set("views", path.join(__dirname, '..', "views"))
app.set("view engine", "hbs")
app.use('/static', express.static('public'));

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
