const sharp = require("sharp")

sharp("srcImg.svg")
  .png({quality: 100})
  .resize(800, 800)
  .toFile("new-file.png")
  .then(function (info) {
    console.log(info)
  })
  .catch(function (err) {
    console.log(err)
  })