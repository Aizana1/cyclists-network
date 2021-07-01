const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = require('../models/users')

router.get('/', async function (req, res) {
  const users = await User.find()
  res.writeHead(200);
  res.json(users)  
})

router.post('/', async (req, res) => {
  const user = new User({
    name: req.body.name,
    age: req.body.age,
  })
  await user.save()  
  res.writeHead(200);
  res.send(user._id)
})
router.get('/form', function (req, res) {
  res.writeHead(200);
  res.render('users')
})
module.exports = router
