module.exports= function(app){

const express= require('express')
const morgan = require('morgan')
const cookieParser = require("cookie-parser")

const session = require("express-session")
const path = require("path")

const FileStore = require("session-file-store")(session)

const { cookiesCleaner } = require("./auth")
  const dbConnection = require("./db-connect")

app.use(morgan("dev"))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(cookieParser())

app.use(
  session({
    store: new FileStore(), // тип хранилища - FileStore, который создаёт нам папку с файлами
    key: "user_sid", // ключ - название куки
    secret: "anything here", // слово используемое для шифрования, может быть любым
    resave: false, // настройка пересохранения куки, при каждом запросе
    saveUninitialized: false, // настройка создания сессии, даже без авторизации
    cookie: {
      expires: 60000000, // время "протухания" куки
      httpOnly: false // по умолчанию true
    }
  })
)

app.use(cookiesCleaner)
app.use(express.static(path.join(__dirname, '..', "public")))

app.set("views", path.join(__dirname, '..', "views"))
app.set("view engine", "hbs")

}
