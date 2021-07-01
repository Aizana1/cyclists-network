const express = require("express");
const router = express.Router();
//const mongoose = require('mongoose')
const Map = require("../models/map");
const Review = require("../models/review");

router
  .route("/")
  .get((req, res) => {
    //const map = await Map.find()
    //res.json(users)
    res.redirect("map/:id");
  })
  .post(async (req, res) => {
    const data = req.body;
    data.author = req.session.user._id;
    if (data) {
      try {
        const mapdoc = await Map.create(data);
        return res.status(201).json({ message: 1 });
      } catch (error) {
        res.send("Ошибка добавления карты в базу данных");
      }
    }
  });


router.get("/:id", async (req, res) => {
  const { user } = req.session;
  const mapID = req.params.id
  const map = await Map.findOne({ _id: mapID });
  // Отзывы
  if (map) {
    const reviews = await Review.find({map: mapID }).exec();
     const srRating =  map.rating.reduce((a,b) => a+(+b), 0) / map.rating.length
     const kolOcenok = map.rating.length
    return res.render("map", { map, user, point1: map.coords[0], point2: map.coords[1], reviews, srRating,kolOcenok});
  }
  res.send("Smth wrong with DB and " + req.params.id + " map");
});


router.post("/newreview", async (req, res) => {
  console.log("OK")
  const { review, mapID, rating } = req.body;
  const data = { 
    content: review, 
    map: mapID,
    author: req.session.user._id
  };
  const updatedmap = await Map.updateOne(
    {_id: mapID},
    { $push: {rating: rating}}
  )
  const reviewdoc = await Review.create(data);
  if (reviewdoc) {
    res.status(201).json({ message: 1, data});
  }
});

module.exports = router;
