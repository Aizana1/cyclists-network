function cookiesCleaner(req, res, next) {
  // если есть кука и нет сессии - удаляем куку
  if (req.cookies.user_sid && !req.session.user) {
    res.clearCookie("user_sid")
  }
  next()
}

// middleware function to check for logged-in users
const sessionChecker = (req, res, next) => {
  if (req.session.user) {
    console.log(req.session);
    res.redirect("/dashboard")
  } else {
    next()
  }
}

module.exports = {
  sessionChecker,
  cookiesCleaner
}
