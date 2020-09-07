var Jimp = require('jimp');
var fs = require('fs');
var colorthief = require('color-thief-jimp');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const pathid = require("./pathtoid.js")

fs.unlink("db.json", () => {});
fs.unlink("colors.txt", () => {})
const adapter = new FileSync('db.json')
const db = low(adapter)

db.defaults({ blocks: []})
  .write()

var colors = new Array();

function getMainColor(path) {
  try {
  Jimp.read(path, (err, img) => {
    if (err) console.log(err);
    try {
      const dominantColor = colorthief.getColor(img);
      var message = `${pathid.getId(path)} : ${dominantColor}\n`;
      console.log(message);
      fs.appendFile('colors.txt', message, function (err) {
        if (err) throw err;
      });
      db.get('blocks')
  .push({ id: pathid.getId(path), color: {r: dominantColor[0], g: dominantColor[1], b: dominantColor[2]}})
  .write()
    } catch (error) {
      console.log(`Failed to getColor: ${path}`);
    }
  });
  } catch (error) {
    console.log(`Failed to Jimp.read: ${path}`);
  }
}

fs.readdir("./images/", (err, images) => {
  images.forEach(file => {
    if(file.endsWith(".png")) getMainColor("./images/" + file);
  })
});