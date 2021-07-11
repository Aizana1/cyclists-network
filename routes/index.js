const express = require("express");
const bcrypt = require("bcrypt");
const { sessionChecker } = require("../middleware/auth");
const User = require("../models/users");
const Map = require("../models/map");
const saltRounds = 10; // количество "путающих" символов (соль)
const router = express.Router();

async function getMaps() {
  let maps = await Map.find({});
  return maps.map((m) => {
    m.rating = m.rating.filter((i) => i != "");
    return m;
  });
}

function transformMapRating(maps) {
  return maps.map((el) => {
    let sum = el.rating.reduce((a, b) => a + +b, 0);
    let avg = sum / el.rating.length || 0;
    el.rating = avg;
    return el;
  });
}
// при переходе на "корень", запускается функция sessionChecker
router.get("/",  async (req, res) => {
  let maps = await getMaps();
  maps = transformMapRating(maps)
  if (req.session.user) {
    const { user } = req.session
    return res.render ('landing', { name: user.username, maps })
  }
  return res.render("landing", { maps });
});

router.get("/sort", async (req, res) => {
  let maps = await getMaps();
  // Сортируем в порядке убывания
  let sortedMaps = maps.sort((el1, el2) => {
    let sum1 = el1.rating.reduce((a, b) => a + +b, 0);
    let avg1 = sum1 / el1.rating.length || 0;

    let sum2 = el2.rating.reduce((a, b) => a + +b, 0);
    let avg2 = sum2 / el2.rating.length || 0;

    return avg2 - avg1;
  });
  sortedMaps = transformMapRating(sortedMaps)
  return res.render("landing", { maps: sortedMaps, layout: false });
});

// оптимизированный вид написания маршрутизации
router
  .route("/signup")
  .get((req, res) => {
    
    if (req.session.user) {
      return res.redirect("/dashboard");
    }

    if(req.query.reg === "fuck") {
      return res.render("signup", {message: "Такой email уже зарегистрирован"});
    }

    res.render("signup");
  })

  // POST запрос с функцией next, для передачи ошибки
  .post(async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const user = new User({
        username,
        email,
        password: await bcrypt.hash(password, saltRounds),
      });
      await user.save();

      req.session.user = user; // формирование сессии, user добавляется в неё как объект
      // console.log(req.session);
      // console.log(req.session.user);
      res.redirect("/dashboard");
    } catch (error) {
      res.redirect("/signup?reg=fuck");
      console.error(error)
    }
  });

router
  .route("/login")

  .get(sessionChecker, (req, res) => {
    if(req.query.email === "not") {
      return res.render("login", {message: "Нет такого email или неверный пароль"});
    }
    res.render("login")
  })

  .post(async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if(!user) {
      return res.redirect("/login?email=not");
    }

    // bcrypt - шифровальщик паролей, сравнивает пароль из POST запроса и пароль из БД  
    if((await bcrypt.compare(password, user.password))) {  
      req.session.user = user; // формирование сессии, user добавляется в неё как объект
      return res.redirect("/dashboard");
    }
    
    res.send("Smth wrong with server...All questions to Sergey")
  });

router.get("/dashboard", (req, res) => {
  // если сессия есть вытаскиваем user, чтобы его рендерить на странице
  if (req.session.user) {
    const { user } = req.session;
    res.render("dashboard", { name: user.username });
  } else {
    res.redirect("/login");
  }
});

router.get("/logout", async (req, res, next) => {
  // если сессия существует, то выполняем код через try catch
  if (req.session.user) {
    try {
      // уничтожает сессию (удаление файла)
      await req.session.destroy();
      // чистит куку (удаление в браузере)
      res.clearCookie("user_sid");
      // редиректит на корень
      res.redirect("/");
    } catch (error) {
      // "улетаем" в обработчик ошибок (см. /middleware/error-handlers)
      next(error);
    }
  } else {
    res.redirect("/login");
  }
});

router.get("/", (req, res) => {
  res.redirect("/new");
});

module.exports = router;
