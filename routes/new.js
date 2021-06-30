const express = require('express')
const router = express.Router()
//const mongoose = require('mongoose')
//const Map = require('../models/map')

router.get('/', function (req, res) {
  // если сессия есть вытаскиваем user, чтобы его рендерить на странице
  if (req.session.user) {
    const { user } = req.session
    res.render ('newform', { name: user.username })
  } else {
    res.redirect("/login")
  }
  
})

module.exports = router
