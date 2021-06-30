const mongoose = require('mongoose')

mongoose.connect("mongodb://localhost:27017/project-cycling", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

module.exports = mongoose.connection
